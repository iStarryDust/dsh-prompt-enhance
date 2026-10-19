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
import { Context } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { PromptEnhanceConfig } from './settings.ts';
import type { EnhanceRequest, EnhanceValue, TemplatesValue, WriteTemplatesRequest } from './types.ts';
export { Config } from './settings.ts';
export type { PromptEnhanceConfig } from './settings.ts';
export { DEFAULT_SYSTEM_TEMPLATE, DEFAULT_USER_TEMPLATE, promptsDir, readTemplate, renderUserPrompt, writeTemplate, } from './templates.ts';
export type * from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Host owner of the `promptEnhance` Remote namespace. */
        promptEnhance: PromptEnhance;
    }
}
/**
 * The `promptEnhance` Remote service: one rewrite verb over the session's
 * model and the template verbs over the bundle's prompts directory.
 */
export declare class PromptEnhance extends TypertRemoteService {
    private readonly config;
    /** Injected runtime: the shared LLM stream used for every rewrite. */
    static inject: string[];
    /** Volatile settings schema (the settings page writes through it). */
    static Config: import("@deepseek-ai/schemastery").default<Schemastery.ObjectS<NoInfer<{
        enabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "volatile-defined">;
        overrideModel: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
        temperature: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
        maxTokens: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
        timeoutMs: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        enabled: import("@deepseek-ai/schemastery").default<boolean, boolean, "volatile-defined">;
        overrideModel: import("@deepseek-ai/schemastery").default<string, string, "volatile-defined">;
        temperature: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
        maxTokens: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
        timeoutMs: import("@deepseek-ai/schemastery").default<number, number, "volatile-defined">;
    }>>, "plain">;
    /**
     * @param ctx - host context carrying the `llm` service.
     * @param config - validated volatile configuration.
     */
    constructor(ctx: Context, config: PromptEnhanceConfig);
    /**
     * Rewrite one draft into an enhanced prompt with the current model.
     * @param request - the draft text plus the session's current model (empty
     * strings fall back to the configured override).
     * @param signal - caller lifetime; abort stops the rewrite end to end.
     * @returns the enhanced prompt text.
     * @throws RemoteError on empty input, missing model, LLM failure, or abort.
     */
    enhance(request: EnhanceRequest, signal: AbortSignal): Promise<EnhanceValue>;
    /**
     * Serve both templates for the settings page: file texts when present, the
     * built-in defaults otherwise.
     * @returns the effective templates and their on-disk paths.
     */
    readTemplates(): TemplatesValue;
    /**
     * Save both template files from the settings page editor.
     * @param request - full replacement text for each template.
     * @returns the templates as they now read back from disk.
     * @throws RemoteError when the prompts directory cannot be resolved or written.
     */
    writeTemplates(request: WriteTemplatesRequest): Promise<TemplatesValue>;
    /**
     * Restore both template files to the built-in defaults (writes the defaults
     * back to disk; on-disk edits win again from the next call).
     * @returns the templates as they now read back from disk.
     * @throws RemoteError when the prompts directory cannot be resolved or written.
     */
    restoreTemplates(): Promise<TemplatesValue>;
}
/** The plugin entry the bundle loader instantiates. */
export default PromptEnhance;
//# sourceMappingURL=index.d.ts.map