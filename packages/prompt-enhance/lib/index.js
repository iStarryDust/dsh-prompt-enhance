import { BlockAssembler } from "@deepseek-ai/dsh-llm";
import { Remote, RemoteError, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { z } from "zod";
import z$1 from "@deepseek-ai/schemastery";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
//#region lib/types/settings.js
/**
* `promptEnhance` plugin configuration. Every field is volatile: the values
* live in the settings store (hot-editable from the settings page through the
* shared configuration form) instead of the composition config.
*
* @module @istarry/dsh-prompt-enhance/settings
*/
/** schemastery schema for the plugin configuration (volatile fields only). */
const Config = z$1.object({
	enabled: z$1.boolean().default(true).volatile(),
	overrideModel: z$1.string().default("").volatile(),
	temperature: z$1.number().min(0).max(2).default(.7).volatile(),
	maxTokens: z$1.number().step(1).min(64).max(65536).default(2048).volatile(),
	timeoutMs: z$1.number().step(1).min(1e3).max(6e5).default(18e4).volatile()
});
//#endregion
//#region lib/types/templates.js
/**
* The enhancement prompt templates. Defaults are built in; the effective texts
* live beside the bundle as `prompts/system-template.md` and
* `prompts/user-template.md` and are re-read on EVERY enhancement, so edits
* on disk apply from the next call without a restart. A missing, empty, or
* unreadable file falls back to the built-in default.
*
* @module @istarry/dsh-prompt-enhance/templates
*/
/** File name of the system template beside the bundle. */
const SYSTEM_TEMPLATE_FILE = "system-template.md";
/** File name of the user template beside the bundle. */
const USER_TEMPLATE_FILE = "user-template.md";
/** Placeholder in the user template replaced with the draft text. */
const INPUT_PLACEHOLDER = "{input}";
/** Built-in system template: a prompt-engineering rewrite policy. */
const DEFAULT_SYSTEM_TEMPLATE = [
	"You are a Prompt Engineering Expert specializing in improving user prompts for a development",
	"code assistant. When given a prompt, analyze and enhance it to create a more effective version",
	"while maintaining its core purpose. The requests are being made to an AI assistant that",
	"specializes in writing code.",
	"",
	"TASK: When given a prompt, analyze and enhance it to create a more effective version while",
	"maintaining its core purpose.",
	"",
	"ANALYSIS PROCESS:",
	"Evaluate the original prompt:",
	"  Identify the main objective / Note any ambiguities or gaps / Assess the clarity of instructions",
	"  / Check for missing context",
	"Apply these prompt engineering principles:",
	"  Write clear, specific instructions / Include necessary context / Set explicit parameters and",
	"  constraints / Structure the output format / Add relevant examples / Match tone and complexity",
	"  to the use case / Remove redundant information",
	"Create the enhanced version:",
	"  Maintain the original goal / Incorporate identified improvements / Ensure clarity and",
	"  completeness / Be realistic in the features to add",
	"  Do NOT request guides/how-tos unless the user asks",
	"  Do NOT ask for code snippets",
	"  Do NOT suggest specific technologies unless mentioned in the user's prompt",
	"  Do NOT explain HOW to do things, focus on WHAT",
	"  Do NOT answer questions - expand/rewrite them to be more detailed",
	"",
	"IMPORTANT CONSTRAINTS:",
	"1. Language matching is the highest priority - respond in the exact same language as the user's",
	"   input. (中文输入→中文输出；混输→自然混排，不要强行翻译成单一语言)",
	"2. Keep the enhanced prompt concise - maximum length should be around 800 characters",
	"",
	"FORMAT: Provide only the enhanced prompt with no additional commentary."
].join("\n");
/** Built-in user template; `{input}` receives the draft text. */
const DEFAULT_USER_TEMPLATE = [
	"You are a prompt enhancement assistant. Improve the user prompt while preserving its intent and",
	"language.",
	"",
	"USER INPUT:",
	"{input}",
	"",
	"TASK:",
	"Rewrite the user input into a clearer, more specific prompt for the target AI assistant.",
	"",
	"CRITICAL PRIORITY - LANGUAGE CONSISTENCY:",
	"1. Detect the user input's language and write the enhanced prompt in that same language.",
	"2. 中文输入 → 全中文输出，不要出现英文句子或标签。",
	"3. 英文输入 → 全英文输出，不要出现中文句子或标签。",
	"4. 其他语言同理，始终与输入语言一致。",
	"5. 混合语言输入 → 保持自然的混排比例，不要强行翻译成单一语言。",
	"6. These language rules are behavior instructions only; never include language analysis or labels.",
	"",
	"ENHANCEMENT REQUIREMENTS:",
	"1. Return only the enhanced prompt text; no explanations, prefaces, markdown fences, labels.",
	"2. Do not output meta notes like \"User input is in Chinese\".",
	"3. Preserve original intent, topic, constraints, target output type. Do not answer the request.",
	"4. Always make a substantive enhancement when possible.",
	"5. If already clear, lightly polish instead of returning unchanged.",
	"6. Keep it complete and concise — no dangling conjunction or trailing colon.",
	"7. Do not add unrelated requirements, unsupported facts, or unnecessary sections.",
	"",
	"EXAMPLES:",
	"\"请帮我解释这段代码的功能\"",
	"→ \"请解释这段代码的主要功能、执行流程和关键逻辑，并指出可能需要注意的边界情况。\"",
	"",
	"\"Please explain what this code does\"",
	"→ \"Explain what this code does, including its main purpose, key control flow, and any",
	"   important edge cases.\"",
	"",
	"\"这段代码有 bug，can you help me fix it?\"",
	"→ \"请分析这段代码中的 bug，explain the root cause, and provide a minimal fix with necessary",
	"   verification steps.\"",
	"",
	"BAD OUTPUT EXAMPLE: \"User input is in Chinese → Response must be in Chinese. 请解释这段代码…\"",
	"GOOD OUTPUT EXAMPLE: \"请解释这段代码的主要功能、执行流程和关键逻辑，并指出边界情况。\""
].join("\n");
/**
* Resolve the prompts directory beside the bundle: the compiled artifact sits
* at `<bundle>/packages/prompt-enhance/lib/index.js`, so three levels up from
* the artifact's directory is the bundle root and the templates live in its
* `prompts/` folder — the same files the bundle ships. A dev checkout resolves
* to a nonexistent sibling, which reads as "no files" and writes there on
* first save.
* @returns the absolute prompts directory, or null when the artifact URL cannot be resolved.
*/
function promptsDir() {
	try {
		return resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "prompts");
	} catch {
		return null;
	}
}
/** Absolute path of one template file; 'system' | 'user'. */
function templatePath(kind) {
	const dir = promptsDir();
	if (dir === null) return null;
	return join(dir, kind === "system" ? SYSTEM_TEMPLATE_FILE : USER_TEMPLATE_FILE);
}
/** Built-in default text of one template kind. */
function defaultText(kind) {
	return kind === "system" ? DEFAULT_SYSTEM_TEMPLATE : DEFAULT_USER_TEMPLATE;
}
/**
* Read one template: the file's content when present and non-empty, the
* built-in default otherwise.
* @param kind - which template to read.
* @returns the effective text with its source provenance.
*/
function readTemplate(kind) {
	const path = templatePath(kind);
	const fallback = {
		path: path ?? `(unresolved)/${kind}`,
		text: defaultText(kind),
		fromFile: false
	};
	if (path === null) return fallback;
	try {
		if (!existsSync(path)) return fallback;
		const text = readFileSync(path, "utf8");
		if (text.trim() === "") return fallback;
		return {
			path,
			text,
			fromFile: true
		};
	} catch {
		return fallback;
	}
}
/**
* Write one template file, creating the prompts directory on first save.
* @param kind - which template to write.
* @param text - full replacement text.
* @returns the absolute path written.
*/
function writeTemplate(kind, text) {
	const path = templatePath(kind);
	if (path === null) throw new Error("prompt-enhance: prompts directory could not be resolved");
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, text, "utf8");
	return path;
}
/**
* Render the user prompt: replace every `{input}` placeholder with the draft;
* a template without the placeholder takes the draft as the whole message,
* appended after the template text.
* @param template - the effective user template text.
* @param input - the draft text.
* @returns the rendered user prompt.
*/
function renderUserPrompt(template, input) {
	if (template.includes("{input}")) return template.split(INPUT_PLACEHOLDER).join(input);
	return `${template.replace(/\s+$/, "")}\n\n${input}`;
}
//#endregion
//#region lib/types/index.js
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
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
const enhanceRequestSchema = z.object({
	text: z.string().min(1),
	provider: z.string(),
	model: z.string()
});
const writeTemplatesRequestSchema = z.object({
	system: z.string(),
	user: z.string()
});
/** Strip one layer of wrapping quotes the model may add around the rewrite. */
function stripWrappingQuotes(text) {
	return text.trim().replace(/^["'“”‘’]+/, "").replace(/["'“”‘’]+$/, "").trim();
}
/** Combine the caller signal with the configured timeout wall. */
function deadlineSignal(signal, timeoutMs) {
	const timeout = AbortSignal.timeout(timeoutMs);
	return typeof AbortSignal.any === "function" && signal !== void 0 ? AbortSignal.any([signal, timeout]) : timeout;
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
		if (signal.aborted) throw new RemoteError("gateway/cancelled", "prompt enhancement was aborted", {});
		if (finished) throw new RemoteError("gateway/internal", "prompt enhancement emitted data after its finish", {});
		assembler.push(chunk);
		if (chunk.type === "finish") {
			finished = true;
			if (chunk.reason.kind === "aborted") throw new RemoteError("gateway/cancelled", "prompt enhancement was aborted", {});
			if (chunk.reason.kind === "error") {
				const { code, message } = chunk.reason.failure;
				throw new RemoteError("gateway/internal", `prompt enhancement failed: ${code} ${message}`, {});
			}
			if (chunk.reason.kind !== "stop") throw new RemoteError("gateway/internal", `prompt enhancement ended with ${chunk.reason.kind}`, {});
		}
	}
	if (!finished) throw new RemoteError("gateway/internal", "prompt enhancement ended without a finish", {});
	const final = assembler.blocks().at(-1);
	if (final?.type !== "text") throw new RemoteError("gateway/internal", "prompt enhancement produced no text", {});
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
			__esDecorate(this, null, _enhance_decorators, {
				kind: "method",
				name: "enhance",
				static: false,
				private: false,
				access: {
					has: (obj) => "enhance" in obj,
					get: (obj) => obj.enhance
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _readTemplates_decorators, {
				kind: "method",
				name: "readTemplates",
				static: false,
				private: false,
				access: {
					has: (obj) => "readTemplates" in obj,
					get: (obj) => obj.readTemplates
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _writeTemplates_decorators, {
				kind: "method",
				name: "writeTemplates",
				static: false,
				private: false,
				access: {
					has: (obj) => "writeTemplates" in obj,
					get: (obj) => obj.writeTemplates
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _restoreTemplates_decorators, {
				kind: "method",
				name: "restoreTemplates",
				static: false,
				private: false,
				access: {
					has: (obj) => "restoreTemplates" in obj,
					get: (obj) => obj.restoreTemplates
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		config = __runInitializers(this, _instanceExtraInitializers);
		/** Injected runtime: the shared LLM stream used for every rewrite. */
		static inject = ["llm"];
		/** Volatile settings schema (the settings page writes through it). */
		static Config = Config;
		/**
		* @param ctx - host context carrying the `llm` service.
		* @param config - validated volatile configuration.
		*/
		constructor(ctx, config) {
			super(ctx, "promptEnhance");
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
			if (!parsed.success) throw new RemoteError("gateway/bad-request", "invalid enhance request", { issues: parsed.error.issues });
			const text = parsed.data.text.trim();
			if (text === "") throw new RemoteError("gateway/bad-request", "cannot enhance an empty prompt", {});
			const override = this.config.overrideModel.get().trim();
			let provider = parsed.data.provider.trim();
			let model = parsed.data.model.trim();
			if (override !== "") {
				const slash = override.indexOf("/");
				provider = slash < 0 ? override : override.slice(0, slash);
				model = slash < 0 ? "" : override.slice(slash + 1);
			}
			if (provider === "" || model === "") throw new RemoteError("gateway/bad-request", "no model available for prompt enhancement", {});
			const system = readTemplate("system");
			const user = readTemplate("user");
			const deadline = deadlineSignal(signal, this.config.timeoutMs.get());
			const options = {
				provider,
				model,
				system: system.text,
				messages: [{
					role: "user",
					content: [{
						type: "text",
						text: renderUserPrompt(user.text, text)
					}]
				}],
				temperature: this.config.temperature.get(),
				maxTokens: this.config.maxTokens.get(),
				signal: deadline
			};
			let output;
			try {
				output = await readText(this.ctx.llm.stream(options), deadline);
			} catch (error) {
				if (error instanceof RemoteError) throw error;
				throw new RemoteError("gateway/internal", `prompt enhancement failed: ${error instanceof Error ? error.message : String(error)}`, {}, { cause: error });
			}
			const enhanced = stripWrappingQuotes(output);
			if (enhanced === "") throw new RemoteError("gateway/internal", "prompt enhancement produced an empty prompt", {});
			return { text: enhanced };
		}
		/**
		* Serve both templates for the settings page: file texts when present, the
		* built-in defaults otherwise.
		* @returns the effective templates and their on-disk paths.
		*/
		readTemplates() {
			const system = readTemplate("system");
			const user = readTemplate("user");
			return {
				promptsDir: promptsDir() ?? "",
				system,
				user
			};
		}
		/**
		* Save both template files from the settings page editor.
		* @param request - full replacement text for each template.
		* @returns the templates as they now read back from disk.
		* @throws RemoteError when the prompts directory cannot be resolved or written.
		*/
		writeTemplates(request) {
			const parsed = writeTemplatesRequestSchema.safeParse(request);
			if (!parsed.success) throw new RemoteError("gateway/bad-request", "invalid writeTemplates request", { issues: parsed.error.issues });
			try {
				writeTemplate("system", parsed.data.system);
				writeTemplate("user", parsed.data.user);
			} catch (error) {
				throw new RemoteError("gateway/internal", `template save failed: ${error instanceof Error ? error.message : String(error)}`, {}, { cause: error });
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
			return this.writeTemplates({
				system: DEFAULT_SYSTEM_TEMPLATE,
				user: DEFAULT_USER_TEMPLATE
			});
		}
	};
})();
//#endregion
export { Config, DEFAULT_SYSTEM_TEMPLATE, DEFAULT_USER_TEMPLATE, PromptEnhance, PromptEnhance as default, promptsDir, readTemplate, renderUserPrompt, writeTemplate };
