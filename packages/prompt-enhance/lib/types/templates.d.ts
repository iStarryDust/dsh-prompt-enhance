/**
 * The enhancement prompt templates. Defaults are built in; the effective texts
 * live beside the bundle as `prompts/system-template.md` and
 * `prompts/user-template.md` and are re-read on EVERY enhancement, so edits
 * on disk apply from the next call without a restart. A missing, empty, or
 * unreadable file falls back to the built-in default.
 *
 * @module @istarry/dsh-prompt-enhance/templates
 */
import type { TemplateFile } from './types.ts';
/** File name of the system template beside the bundle. */
export declare const SYSTEM_TEMPLATE_FILE = "system-template.md";
/** File name of the user template beside the bundle. */
export declare const USER_TEMPLATE_FILE = "user-template.md";
/** Placeholder in the user template replaced with the draft text. */
export declare const INPUT_PLACEHOLDER = "{input}";
/** Built-in system template: a prompt-engineering rewrite policy. */
export declare const DEFAULT_SYSTEM_TEMPLATE: string;
/** Built-in user template; `{input}` receives the draft text. */
export declare const DEFAULT_USER_TEMPLATE: string;
/**
 * Resolve the prompts directory beside the bundle: the compiled artifact sits
 * at `<bundle>/packages/prompt-enhance/lib/index.js`, so three levels up from
 * the artifact's directory is the bundle root and the templates live in its
 * `prompts/` folder — the same files the bundle ships. A dev checkout resolves
 * to a nonexistent sibling, which reads as "no files" and writes there on
 * first save.
 * @returns the absolute prompts directory, or null when the artifact URL cannot be resolved.
 */
export declare function promptsDir(): string | null;
/** Absolute path of one template file; 'system' | 'user'. */
export declare function templatePath(kind: 'system' | 'user'): string | null;
/**
 * Read one template: the file's content when present and non-empty, the
 * built-in default otherwise.
 * @param kind - which template to read.
 * @returns the effective text with its source provenance.
 */
export declare function readTemplate(kind: 'system' | 'user'): TemplateFile;
/**
 * Write one template file, creating the prompts directory on first save.
 * @param kind - which template to write.
 * @param text - full replacement text.
 * @returns the absolute path written.
 */
export declare function writeTemplate(kind: 'system' | 'user', text: string): string;
/**
 * Render the user prompt: replace every `{input}` placeholder with the draft;
 * a template without the placeholder takes the draft as the whole message,
 * appended after the template text.
 * @param template - the effective user template text.
 * @param input - the draft text.
 * @returns the rendered user prompt.
 */
export declare function renderUserPrompt(template: string, input: string): string;
//# sourceMappingURL=templates.d.ts.map