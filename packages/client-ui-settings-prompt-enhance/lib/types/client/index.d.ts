/**
 * Prompt-enhance settings page, browser half: registers the 增强提示词 section
 * once the settings shell's section slot is on the ledger. The switch and the
 * generation parameters ride the shared configuration form for the host
 * plugin's `prompt-enhance` namespace, and the prompt templates ride the
 * `promptEnhance` Remote namespace (soft-resolved at call time: the page
 * renders before or without the namespace).
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type PromptEnhanceSettingsKey } from './locales.ts';
export { EnhanceSection } from './EnhanceSection.tsx';
export type { EnhanceSectionInjected, EnhanceSectionProps } from './EnhanceSection.tsx';
export { EnhanceSettingsController, decodeEnhanceParams } from './enhance-store.ts';
export type { EnhanceParams, EnhanceRemote, EnhanceSectionState, EnhanceTemplatesState } from './enhance-store.ts';
export type { PromptEnhanceSettingsKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The prompt-enhance settings page copy. */
        'settings.promptEnhance': PromptEnhanceSettingsKey;
    }
}
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Register the prompt-enhance section and its dictionaries.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map