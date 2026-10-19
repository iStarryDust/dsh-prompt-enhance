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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { BlockAssembler } from '@deepseek-ai/dsh-llm';
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { z } from 'zod';
import { Config } from "./settings.js";
import { DEFAULT_SYSTEM_TEMPLATE, DEFAULT_USER_TEMPLATE, promptsDir, readTemplate, renderUserPrompt, writeTemplate } from "./templates.js";
export { Config } from "./settings.js";
export { DEFAULT_SYSTEM_TEMPLATE, DEFAULT_USER_TEMPLATE, promptsDir, readTemplate, renderUserPrompt, writeTemplate, } from "./templates.js";
const enhanceRequestSchema = z.object({
    text: z.string().min(1),
    provider: z.string(),
    model: z.string(),
});
const writeTemplatesRequestSchema = z.object({
    system: z.string(),
    user: z.string(),
});
/** Strip one layer of wrapping quotes the model may add around the rewrite. */
function stripWrappingQuotes(text) {
    return text.trim().replace(/^["'“”‘’]+/, '').replace(/["'“”‘’]+$/, '').trim();
}
/** Combine the caller signal with the configured timeout wall. */
function deadlineSignal(signal, timeoutMs) {
    const timeout = AbortSignal.timeout(timeoutMs);
    return typeof AbortSignal.any === 'function' && signal !== undefined
        ? AbortSignal.any([signal, timeout])
        : timeout;
}
/**
 * Fold one LLM stream into its single trailing text block, rejecting
 * aborted/errored finishes like the official one-shot callers do.
 * @param stream - the LLM chunk stream.
 * @param signal - the request deadline signal, polled for early cancellation.
 * @returns the final text block's content.
 */
async function readText(stream, signal) {
    const assembler = new BlockAssembler();
    let finished = false;
    for await (const chunk of stream) {
        if (signal.aborted)
            throw new RemoteError('gateway/cancelled', 'prompt enhancement was aborted', {});
        if (finished)
            throw new RemoteError('gateway/internal', 'prompt enhancement emitted data after its finish', {});
        assembler.push(chunk);
        if (chunk.type === 'finish') {
            finished = true;
            if (chunk.reason.kind === 'aborted') {
                throw new RemoteError('gateway/cancelled', 'prompt enhancement was aborted', {});
            }
            if (chunk.reason.kind === 'error') {
                const { code, message } = chunk.reason.failure;
                throw new RemoteError('gateway/internal', `prompt enhancement failed: ${code} ${message}`, {});
            }
            if (chunk.reason.kind !== 'stop') {
                throw new RemoteError('gateway/internal', `prompt enhancement ended with ${chunk.reason.kind}`, {});
            }
        }
    }
    if (!finished)
        throw new RemoteError('gateway/internal', 'prompt enhancement ended without a finish', {});
    const final = assembler.blocks().at(-1);
    if (final?.type !== 'text') {
        throw new RemoteError('gateway/internal', 'prompt enhancement produced no text', {});
    }
    return final.text;
}
/**
 * The `promptEnhance` Remote service: one rewrite verb over the session's
 * model and the template verbs over the bundle's prompts directory.
 */
let PromptEnhance = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _enhance_decorators;
    let _readTemplates_decorators;
    let _writeTemplates_decorators;
    let _restoreTemplates_decorators;
    return class PromptEnhance extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _enhance_decorators = [Remote];
            _readTemplates_decorators = [Remote];
            _writeTemplates_decorators = [Remote];
            _restoreTemplates_decorators = [Remote];
            __esDecorate(this, null, _enhance_decorators, { kind: "method", name: "enhance", static: false, private: false, access: { has: obj => "enhance" in obj, get: obj => obj.enhance }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _readTemplates_decorators, { kind: "method", name: "readTemplates", static: false, private: false, access: { has: obj => "readTemplates" in obj, get: obj => obj.readTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _writeTemplates_decorators, { kind: "method", name: "writeTemplates", static: false, private: false, access: { has: obj => "writeTemplates" in obj, get: obj => obj.writeTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _restoreTemplates_decorators, { kind: "method", name: "restoreTemplates", static: false, private: false, access: { has: obj => "restoreTemplates" in obj, get: obj => obj.restoreTemplates }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        config = __runInitializers(this, _instanceExtraInitializers);
        /** Injected runtime: the shared LLM stream used for every rewrite. */
        static inject = ['llm'];
        /** Volatile settings schema (the settings page writes through it). */
        static Config = Config;
        /**
         * @param ctx - host context carrying the `llm` service.
         * @param config - validated volatile configuration.
         */
        constructor(ctx, config) {
            super(ctx, 'promptEnhance');
            this.config = config;
        }
        /**
         * Rewrite one draft into an enhanced prompt with the current model.
         * @param request - the draft text plus the session's current model (empty
         * strings fall back to the configured override).
         * @param signal - caller lifetime; abort stops the rewrite end to end.
         * @returns the enhanced prompt text.
         * @throws RemoteError on empty input, missing model, LLM failure, or abort.
         */
        async enhance(request, signal) {
            const parsed = enhanceRequestSchema.safeParse(request);
            if (!parsed.success) {
                throw new RemoteError('gateway/bad-request', 'invalid enhance request', { issues: parsed.error.issues });
            }
            const text = parsed.data.text.trim();
            if (text === '') {
                throw new RemoteError('gateway/bad-request', 'cannot enhance an empty prompt', {});
            }
            const override = this.config.overrideModel.get().trim();
            let provider = parsed.data.provider.trim();
            let model = parsed.data.model.trim();
            if (override !== '') {
                const slash = override.indexOf('/');
                provider = slash < 0 ? override : override.slice(0, slash);
                model = slash < 0 ? '' : override.slice(slash + 1);
            }
            if (provider === '' || model === '') {
                throw new RemoteError('gateway/bad-request', 'no model available for prompt enhancement', {});
            }
            const system = readTemplate('system');
            const user = readTemplate('user');
            const deadline = deadlineSignal(signal, this.config.timeoutMs.get());
            const options = {
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
            };
            let output;
            try {
                output = await readText(this.ctx.llm.stream(options), deadline);
            }
            catch (error) {
                if (error instanceof RemoteError)
                    throw error;
                throw new RemoteError('gateway/internal', `prompt enhancement failed: ${error instanceof Error ? error.message : String(error)}`, {}, { cause: error });
            }
            const enhanced = stripWrappingQuotes(output);
            if (enhanced === '') {
                throw new RemoteError('gateway/internal', 'prompt enhancement produced an empty prompt', {});
            }
            return { text: enhanced };
        }
        /**
         * Serve both templates for the settings page: file texts when present, the
         * built-in defaults otherwise.
         * @returns the effective templates and their on-disk paths.
         */
        readTemplates() {
            const system = readTemplate('system');
            const user = readTemplate('user');
            return { promptsDir: promptsDir() ?? '', system, user };
        }
        /**
         * Save both template files from the settings page editor.
         * @param request - full replacement text for each template.
         * @returns the templates as they now read back from disk.
         * @throws RemoteError when the prompts directory cannot be resolved or written.
         */
        writeTemplates(request) {
            const parsed = writeTemplatesRequestSchema.safeParse(request);
            if (!parsed.success) {
                throw new RemoteError('gateway/bad-request', 'invalid writeTemplates request', { issues: parsed.error.issues });
            }
            try {
                writeTemplate('system', parsed.data.system);
                writeTemplate('user', parsed.data.user);
            }
            catch (error) {
                throw new RemoteError('gateway/internal', `template save failed: ${error instanceof Error ? error.message : String(error)}`, {}, { cause: error });
            }
            return Promise.resolve(this.readTemplates());
        }
        /**
         * Restore both template files to the built-in defaults (writes the defaults
         * back to disk; on-disk edits win again from the next call).
         * @returns the templates as they now read back from disk.
         * @throws RemoteError when the prompts directory cannot be resolved or written.
         */
        restoreTemplates() {
            return this.writeTemplates({ system: DEFAULT_SYSTEM_TEMPLATE, user: DEFAULT_USER_TEMPLATE });
        }
    };
})();
export { PromptEnhance };
/** The plugin entry the bundle loader instantiates. */
export default PromptEnhance;
//# sourceMappingURL=index.js.map