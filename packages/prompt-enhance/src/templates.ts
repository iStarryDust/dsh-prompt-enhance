/**
 * The enhancement prompt templates. Defaults are built in; the effective texts
 * live beside the bundle as `prompts/system-template.md` and
 * `prompts/user-template.md` and are re-read on EVERY enhancement, so edits
 * on disk apply from the next call without a restart. A missing, empty, or
 * unreadable file falls back to the built-in default.
 *
 * @module @istarry/dsh-prompt-enhance/templates
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { TemplateFile } from './types.ts'

/** File name of the system template beside the bundle. */
export const SYSTEM_TEMPLATE_FILE = 'system-template.md'

/** File name of the user template beside the bundle. */
export const USER_TEMPLATE_FILE = 'user-template.md'

/** Placeholder in the user template replaced with the draft text. */
export const INPUT_PLACEHOLDER = '{input}'

/** Built-in system template: a prompt-engineering rewrite policy. */
export const DEFAULT_SYSTEM_TEMPLATE = [
  'You are a Prompt Engineering Expert specializing in improving user prompts for a development',
  'code assistant. When given a prompt, analyze and enhance it to create a more effective version',
  'while maintaining its core purpose. The requests are being made to an AI assistant that',
  'specializes in writing code.',
  '',
  'TASK: When given a prompt, analyze and enhance it to create a more effective version while',
  'maintaining its core purpose.',
  '',
  'ANALYSIS PROCESS:',
  'Evaluate the original prompt:',
  '  Identify the main objective / Note any ambiguities or gaps / Assess the clarity of instructions',
  '  / Check for missing context',
  'Apply these prompt engineering principles:',
  '  Write clear, specific instructions / Include necessary context / Set explicit parameters and',
  '  constraints / Structure the output format / Add relevant examples / Match tone and complexity',
  '  to the use case / Remove redundant information',
  'Create the enhanced version:',
  '  Maintain the original goal / Incorporate identified improvements / Ensure clarity and',
  '  completeness / Be realistic in the features to add',
  '  Do NOT request guides/how-tos unless the user asks',
  '  Do NOT ask for code snippets',
  '  Do NOT suggest specific technologies unless mentioned in the user\'s prompt',
  '  Do NOT explain HOW to do things, focus on WHAT',
  '  Do NOT answer questions - expand/rewrite them to be more detailed',
  '',
  'IMPORTANT CONSTRAINTS:',
  '1. Language matching is the highest priority - respond in the exact same language as the user\'s',
  '   input. (中文输入→中文输出；混输→自然混排，不要强行翻译成单一语言)',
  '2. Keep the enhanced prompt concise - maximum length should be around 800 characters',
  '',
  'FORMAT: Provide only the enhanced prompt with no additional commentary.',
].join('\n')

/** Built-in user template; `{input}` receives the draft text. */
export const DEFAULT_USER_TEMPLATE = [
  'You are a prompt enhancement assistant. Improve the user prompt while preserving its intent and',
  'language.',
  '',
  'USER INPUT:',
  '{input}',
  '',
  'TASK:',
  'Rewrite the user input into a clearer, more specific prompt for the target AI assistant.',
  '',
  'CRITICAL PRIORITY - LANGUAGE CONSISTENCY:',
  '1. Detect the user input\'s language and write the enhanced prompt in that same language.',
  '2. 中文输入 → 全中文输出，不要出现英文句子或标签。',
  '3. 英文输入 → 全英文输出，不要出现中文句子或标签。',
  '4. 其他语言同理，始终与输入语言一致。',
  '5. 混合语言输入 → 保持自然的混排比例，不要强行翻译成单一语言。',
  '6. These language rules are behavior instructions only; never include language analysis or labels.',
  '',
  'ENHANCEMENT REQUIREMENTS:',
  '1. Return only the enhanced prompt text; no explanations, prefaces, markdown fences, labels.',
  '2. Do not output meta notes like "User input is in Chinese".',
  '3. Preserve original intent, topic, constraints, target output type. Do not answer the request.',
  '4. Always make a substantive enhancement when possible.',
  '5. If already clear, lightly polish instead of returning unchanged.',
  '6. Keep it complete and concise — no dangling conjunction or trailing colon.',
  '7. Do not add unrelated requirements, unsupported facts, or unnecessary sections.',
  '',
  'EXAMPLES:',
  '"请帮我解释这段代码的功能"',
  '→ "请解释这段代码的主要功能、执行流程和关键逻辑，并指出可能需要注意的边界情况。"',
  '',
  '"Please explain what this code does"',
  '→ "Explain what this code does, including its main purpose, key control flow, and any',
  '   important edge cases."',
  '',
  '"这段代码有 bug，can you help me fix it?"',
  '→ "请分析这段代码中的 bug，explain the root cause, and provide a minimal fix with necessary',
  '   verification steps."',
  '',
  'BAD OUTPUT EXAMPLE: "User input is in Chinese → Response must be in Chinese. 请解释这段代码…"',
  'GOOD OUTPUT EXAMPLE: "请解释这段代码的主要功能、执行流程和关键逻辑，并指出边界情况。"',
].join('\n')

/**
 * Resolve the prompts directory beside the bundle: the compiled artifact sits
 * at `<bundle>/packages/prompt-enhance/lib/index.js`, so three levels up from
 * the artifact's directory is the bundle root and the templates live in its
 * `prompts/` folder — the same files the bundle ships. A dev checkout resolves
 * to a nonexistent sibling, which reads as "no files" and writes there on
 * first save.
 * @returns the absolute prompts directory, or null when the artifact URL cannot be resolved.
 */
export function promptsDir(): string | null {
  try {
    const artifactDir = dirname(fileURLToPath(import.meta.url))
    return resolve(artifactDir, '..', '..', '..', 'prompts')
  } catch {
    return null
  }
}

/** Absolute path of one template file; 'system' | 'user'. */
export function templatePath(kind: 'system' | 'user'): string | null {
  const dir = promptsDir()
  if (dir === null) return null
  return join(dir, kind === 'system' ? SYSTEM_TEMPLATE_FILE : USER_TEMPLATE_FILE)
}

/** Built-in default text of one template kind. */
function defaultText(kind: 'system' | 'user'): string {
  return kind === 'system' ? DEFAULT_SYSTEM_TEMPLATE : DEFAULT_USER_TEMPLATE
}

/**
 * Read one template: the file's content when present and non-empty, the
 * built-in default otherwise.
 * @param kind - which template to read.
 * @returns the effective text with its source provenance.
 */
export function readTemplate(kind: 'system' | 'user'): TemplateFile {
  const path = templatePath(kind)
  const fallback = { path: path ?? `(unresolved)/${kind}`, text: defaultText(kind), fromFile: false }
  if (path === null) return fallback
  try {
    if (!existsSync(path)) return fallback
    const text = readFileSync(path, 'utf8')
    if (text.trim() === '') return fallback
    return { path, text, fromFile: true }
  } catch {
    return fallback
  }
}

/**
 * Write one template file, creating the prompts directory on first save.
 * @param kind - which template to write.
 * @param text - full replacement text.
 * @returns the absolute path written.
 */
export function writeTemplate(kind: 'system' | 'user', text: string): string {
  const path = templatePath(kind)
  if (path === null) throw new Error('prompt-enhance: prompts directory could not be resolved')
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text, 'utf8')
  return path
}

/**
 * Render the user prompt: replace every `{input}` placeholder with the draft;
 * a template without the placeholder takes the draft as the whole message,
 * appended after the template text.
 * @param template - the effective user template text.
 * @param input - the draft text.
 * @returns the rendered user prompt.
 */
export function renderUserPrompt(template: string, input: string): string {
  if (template.includes(INPUT_PLACEHOLDER)) {
    return template.split(INPUT_PLACEHOLDER).join(input)
  }
  return `${template.replace(/\s+$/, '')}\n\n${input}`
}
