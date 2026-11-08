/**
 * Prompt-enhance surface, browser half: registers the composer's enhance
 * button in the `conversation.input.right` strip. The rewrite rides the
 * `promptEnhance` Remote namespace, soft-resolved at CALL time so the page
 * never waits for the namespace at apply; every other dependency is captured
 * once at apply (the closures never read ctx), which keeps the plugin
 * reinstall-safe.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type PromptEnhanceKey } from './locales.ts';
export { EnhanceButton } from './enhance-button.tsx';
export type { EnhanceButtonProps, EnhanceConfigState, EnhanceInjected } from './enhance-button.tsx';
export type { PromptEnhanceKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The enhance button copy. */
        'promptEnhance': PromptEnhanceKey;
    }
}
/** Required services (cordis fiber inject): all local, captured at apply. */
export declare const inject: string[];
/**
 * Register the enhance button and its dictionaries.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map