/**
 * Prompt-enhance host plugin: a single-turn, context-free prompt rewriter for
 * the composer. The `promptEnhance` Remote namespace serves one rewrite verb
 * (the client's enhance button) plus the template read/write verbs backing
 * the settings page. Every rewrite re-reads the template files beside the
 * bundle, so on-disk edits apply from the next call.
 *
 * The LLM call rides `ctx.llm.stream` exactly like the official one-shot
 * callers (auto-review, compaction): a frozen GenerateOptions, a
 * BlockAssembler to fold the stream into one text block, and the caller's
 * abort signal honored end to end.
 *
 * @module @istarry/dsh-prompt-enhance
 */

import { Context } from '@deepseek-ai/cordis'
import { BlockAssembler } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { z } from 'zod'
import { Config } from './settings.ts'
import type { PromptEnhanceConfig } from './settings.ts'
import { DEFAULT_SYSTEM_TEMPLATE, DEFAULT_USER_TEMPLATE, promptsDir, readTemplate, renderUserPrompt, writeTemplate } from './templates.ts'
import type { EnhanceRequest, EnhanceValue, TemplatesValue, WriteTemplatesRequest } from './types.ts'

export { Config } from './settings.ts'
export type { PromptEnhanceConfig } from './settings.ts'
export {
  DEFAULT_SYSTEM_TEMPLATE,
  DEFAULT_USER_TEMPLATE,
  promptsDir,
  readTemplate,
  renderUserPrompt,
  writeTemplate,
} from './templates.ts'
export type * from './types.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Host owner of the `promptEnhance` Remote namespace. */
    promptEnhance: PromptEnhance
  }
}

const enhanceRequestSchema = z.object({
  text: z.string().min(1),
  provider: z.string(),
  model: z.string(),
})

const writeTemplatesRequestSchema = z.object({
  system: z.string(),
  user: z.string(),
})

/** Strip one layer of wrapping quotes the model may add around the rewrite. */
function stripWrappingQuotes(text: string): string {
  return text.trim().replace(/^["'“”‘’]+/, '').replace(/["'“”‘’]+$/, '').trim()
}

/** Combine the caller signal with the configured timeout wall. */
function deadlineSignal(signal: AbortSignal | undefined, timeoutMs: number): AbortSignal {
  const timeout = AbortSignal.timeout(timeoutMs)
  return typeof AbortSignal.any === 'function' && signal !== undefined
    ? AbortSignal.any([signal, timeout])
    : timeout
}

/**
 * Fold one LLM stream into its single trailing text block, rejecting
 * aborted/errored finishes like the official one-shot callers do.
 * @param stream - the LLM chunk stream.
 * @param signal - the request deadline signal, polled for early cancellation.
 * @returns the final text block's content.
 */
async function readText(stream: AsyncIterable<StreamChunk>, signal: AbortSignal): Promise<string> {
  const assembler = new BlockAssembler()
  let finished = false
  for await (const chunk of stream) {
    if (signal.aborted) throw new RemoteError('gateway/cancelled', 'prompt enhancement was aborted', {})
    if (finished) throw new RemoteError('gateway/internal', 'prompt enhancement emitted data after its finish', {})
    assembler.push(chunk)
    if (chunk.type === 'finish') {
      finished = true
      if (chunk.reason.kind === 'aborted') {
        throw new RemoteError('gateway/cancelled', 'prompt enhancement was aborted', {})
      }
      if (chunk.reason.kind === 'error') {
        const { code, message } = chunk.reason.failure
        throw new RemoteError('gateway/internal', `prompt enhancement failed: ${code} ${message}`, {})
      }
      if (chunk.reason.kind !== 'stop') {
        throw new RemoteError('gateway/internal', `prompt enhancement ended with ${chunk.reason.kind}`, {})
      }
    }
  }
  if (!finished) throw new RemoteError('gateway/internal', 'prompt enhancement ended without a finish', {})
  const final = assembler.blocks().at(-1)
  if (final?.type !== 'text') {
    throw new RemoteError('gateway/internal', 'prompt enhancement produced no text', {})
  }
  return final.text
}

/**
 * The `promptEnhance` Remote service: one rewrite verb over the session's
 * model and the template verbs over the bundle's prompts directory.
 */
export class PromptEnhance extends TypertRemoteService {
  /** Injected runtime: the shared LLM stream used for every rewrite. */
  static inject = ['llm']

  /** Volatile settings schema (the settings page writes through it). */
  static Config = Config

  /**
   * @param ctx - host context carrying the `llm` service.
   * @param config - validated volatile configuration.
   */
  constructor(
    ctx: Context,
    private readonly config: PromptEnhanceConfig,
  ) {
    super(ctx, 'promptEnhance')
  }

  /**
   * Rewrite one draft into an enhanced prompt with the current model.
   * @param request - the draft text plus the session's current model (empty
   * strings fall back to the configured override).
   * @param signal - caller lifetime; abort stops the rewrite end to end.
   * @returns the enhanced prompt text.
   * @throws RemoteError on empty input, missing model, LLM failure, or abort.
   */
  @Remote
  async enhance(request: EnhanceRequest, signal: AbortSignal): Promise<EnhanceValue> {
    const parsed = enhanceRequestSchema.safeParse(request)
    if (!parsed.success) {
      throw new RemoteError('gateway/bad-request', 'invalid enhance request', { issues: parsed.error.issues })
    }
    const text = parsed.data.text.trim()
    if (text === '') {
      throw new RemoteError('gateway/bad-request', 'cannot enhance an empty prompt', {})
    }

    const override = this.config.overrideModel.get().trim()
    let provider = parsed.data.provider.trim()
    let model = parsed.data.model.trim()
    if (override !== '') {
      const slash = override.indexOf('/')
      provider = slash < 0 ? override : override.slice(0, slash)
      model = slash < 0 ? '' : override.slice(slash + 1)
    }
    if (provider === '' || model === '') {
      throw new RemoteError('gateway/bad-request', 'no model available for prompt enhancement', {})
    }

    const system = readTemplate('system')
    const user = readTemplate('user')
    const deadline = deadlineSignal(signal, this.config.timeoutMs.get())
    const options: GenerateOptions = {
      provider,
      model,
      system: system.text,
      messages: [{
        role: 'user',
        content: [{ type: 'text', text: renderUserPrompt(user.text, text) }],
      }],
      temperature: this.config.temperature.get(),
      maxTokens: this.config.maxTokens.get(),
      signal: deadline,
    }

    let output: string
    try {
      output = await readText(this.ctx.llm.stream(options), deadline)
    } catch (error) {
      if (error instanceof RemoteError) throw error
      throw new RemoteError('gateway/internal', `prompt enhancement failed: ${error instanceof Error ? error.message : String(error)}`, {}, { cause: error })
    }
    const enhanced = stripWrappingQuotes(output)
    if (enhanced === '') {
      throw new RemoteError('gateway/internal', 'prompt enhancement produced an empty prompt', {})
    }
    return { text: enhanced }
  }

  /**
   * Serve both templates for the settings page: file texts when present, the
   * built-in defaults otherwise.
   * @returns the effective templates and their on-disk paths.
   */
  @Remote
  readTemplates(): TemplatesValue {
    const system = readTemplate('system')
    const user = readTemplate('user')
    return { promptsDir: promptsDir() ?? '', system, user }
  }

  /**
   * Save both template files from the settings page editor.
   * @param request - full replacement text for each template.
   * @returns the templates as they now read back from disk.
   * @throws RemoteError when the prompts directory cannot be resolved or written.
   */
  @Remote
  writeTemplates(request: WriteTemplatesRequest): Promise<TemplatesValue> {
    const parsed = writeTemplatesRequestSchema.safeParse(request)
    if (!parsed.success) {
      throw new RemoteError('gateway/bad-request', 'invalid writeTemplates request', { issues: parsed.error.issues })
    }
    try {
      writeTemplate('system', parsed.data.system)
      writeTemplate('user', parsed.data.user)
    } catch (error) {
      throw new RemoteError('gateway/internal', `template save failed: ${error instanceof Error ? error.message : String(error)}`, {}, { cause: error })
    }
    return Promise.resolve(this.readTemplates())
  }

  /**
   * Restore both template files to the built-in defaults (writes the defaults
   * back to disk; on-disk edits win again from the next call).
   * @returns the templates as they now read back from disk.
   * @throws RemoteError when the prompts directory cannot be resolved or written.
   */
  @Remote
  restoreTemplates(): Promise<TemplatesValue> {
    return this.writeTemplates({ system: DEFAULT_SYSTEM_TEMPLATE, user: DEFAULT_USER_TEMPLATE })
  }
}

/** The plugin entry the bundle loader instantiates. */
export default PromptEnhance
