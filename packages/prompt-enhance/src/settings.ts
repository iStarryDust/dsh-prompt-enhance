/**
 * `promptEnhance` plugin configuration. Every field is volatile: the values
 * live in the settings store (hot-editable from the settings page through the
 * shared configuration form) instead of the composition config.
 *
 * @module @istarry/dsh-prompt-enhance/settings
 */

import type { Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'

/** The resolved plugin configuration as handed to the service constructor. */
export interface PromptEnhanceConfig {
  /** Whether the composer's enhance button is offered at all (client-side switch). */
  enabled: Volatile<boolean>
  /**
   * Model override spelled `provider/model`; empty follows the session's
   * current selection.
   */
  overrideModel: Volatile<string>
  /** Sampling temperature of the rewrite call (default 0.7). */
  temperature: Volatile<number>
  /** Output token budget of the rewrite call (default 2048). */
  maxTokens: Volatile<number>
  /** Hard wall-clock budget of one rewrite call in ms (default 180,000). */
  timeoutMs: Volatile<number>
}

/** schemastery schema for the plugin configuration (volatile fields only). */
export const Config = z.object({
  enabled: z.boolean().default(true).volatile(),
  overrideModel: z.string().default('').volatile(),
  temperature: z.number().min(0).max(2).default(0.7).volatile(),
  maxTokens: z.number().step(1).min(64).max(65536).default(2048).volatile(),
  timeoutMs: z.number().step(1).min(1000).max(600_000).default(180_000).volatile(),
})
