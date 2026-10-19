/**
 * `promptEnhance` plugin configuration. Every field is volatile: the values
 * live in the settings store (hot-editable from the settings page through the
 * shared configuration form) instead of the composition config.
 *
 * @module @istarry/dsh-prompt-enhance/settings
 */
import type { Volatile } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** The resolved plugin configuration as handed to the service constructor. */
export interface PromptEnhanceConfig {
    /** Whether the composer's enhance button is offered at all (client-side switch). */
    enabled: Volatile<boolean>;
    /**
     * Model override spelled `provider/model`; empty follows the session's
     * current selection.
     */
    overrideModel: Volatile<string>;
    /** Sampling temperature of the rewrite call (default 0.7). */
    temperature: Volatile<number>;
    /** Output token budget of the rewrite call (default 2048). */
    maxTokens: Volatile<number>;
    /** Hard wall-clock budget of one rewrite call in ms (default 180,000). */
    timeoutMs: Volatile<number>;
}
/** schemastery schema for the plugin configuration (volatile fields only). */
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
    overrideModel: z<string, string, "volatile-defined">;
    temperature: z<number, number, "volatile-defined">;
    maxTokens: z<number, number, "volatile-defined">;
    timeoutMs: z<number, number, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    enabled: z<boolean, boolean, "volatile-defined">;
    overrideModel: z<string, string, "volatile-defined">;
    temperature: z<number, number, "volatile-defined">;
    maxTokens: z<number, number, "volatile-defined">;
    timeoutMs: z<number, number, "volatile-defined">;
}>>, "plain">;
//# sourceMappingURL=settings.d.ts.map