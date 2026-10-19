/**
 * `promptEnhance` plugin configuration. Every field is volatile: the values
 * live in the settings store (hot-editable from the settings page through the
 * shared configuration form) instead of the composition config.
 *
 * @module @istarry/dsh-prompt-enhance/settings
 */
import z from '@deepseek-ai/schemastery';
/** schemastery schema for the plugin configuration (volatile fields only). */
export const Config = z.object({
    enabled: z.boolean().default(true).volatile(),
    overrideModel: z.string().default('').volatile(),
    temperature: z.number().min(0).max(2).default(0.7).volatile(),
    maxTokens: z.number().step(1).min(64).max(65536).default(2048).volatile(),
    timeoutMs: z.number().step(1).min(1000).max(600_000).default(180_000).volatile(),
});
//# sourceMappingURL=settings.js.map