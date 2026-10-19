/**
 * Wire types of the `promptEnhance` Remote namespace. Every field stays a
 * required primitive or a nested wire object: optional members are spelled as
 * empty strings so the generated codecs never meet `undefined`.
 *
 * @module @istarry/dsh-prompt-enhance/types
 */

/** One prompt-enhancement request over the session's current model. */
export interface EnhanceRequest {
  /** The draft text to rewrite; whitespace-only input is rejected. */
  text: string
  /** The session's current provider id; empty when the client could not read one. */
  provider: string
  /** The session's current model id; empty when the client could not read one. */
  model: string
}

/** One finished enhancement: the rewritten prompt, ready to replace the draft. */
export interface EnhanceValue {
  /** The enhanced prompt text. */
  text: string
}

/** One editable template as served to the settings page. */
export interface TemplateFile {
  /** Absolute path of the on-disk template (present even before first write). */
  path: string
  /** The effective text: the file's content, or the built-in default. */
  text: string
  /** Whether the text came from the file rather than the built-in default. */
  fromFile: boolean
}

/** Both templates plus the directory that owns them on disk. */
export interface TemplatesValue {
  /** Absolute directory holding the two template files. */
  promptsDir: string
  /** The system template. */
  system: TemplateFile
  /** The user template. */
  user: TemplateFile
}

/** One template-save request; both texts are always sent. */
export interface WriteTemplatesRequest {
  /** Full replacement text for the system template. */
  system: string
  /** Full replacement text for the user template. */
  user: string
}
