import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { EnhanceParams, EnhanceSectionState } from './enhance-store.ts';
/** Settings actions and their shared controller state. */
export interface EnhanceSectionInjected {
    hooks: {
        /** Page snapshot bound by the renderer as useEnhanceSection. */
        enhanceSection: SnapshotStore<EnhanceSectionState>;
    };
    /** Toggle the enable switch. */
    toggleEnabled: (next: boolean) => Promise<void>;
    /** Update one parameter draft field. */
    setParam: <K extends keyof EnhanceParams>(field: K, value: EnhanceParams[K]) => void;
    /** Save the parameter draft. */
    saveParams: () => Promise<void>;
    /** Update one template draft. */
    setTemplate: (kind: 'system' | 'user', text: string) => void;
    /** Save both template files. */
    saveTemplates: () => Promise<void>;
    /** Restore both templates to the built-in defaults. */
    restoreTemplates: () => Promise<void>;
    /** Load both templates into the editor. */
    loadTemplates: () => Promise<void>;
    loadModels: () => Promise<void>;
}
/** Props assembled by the settings renderer. */
export type EnhanceSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.promptEnhance'> & InjectFace<EnhanceSectionInjected>;
/**
 * Render the prompt-enhance settings section.
 * @param props - settings actions, snapshot hook, and localized copy.
 * @returns the section page.
 */
export declare function EnhanceSection({ useEnhanceSection, toggleEnabled, setParam, saveParams, loadModels, setTemplate, saveTemplates, restoreTemplates, loadTemplates, t, }: EnhanceSectionProps): import("react").JSX.Element;
//# sourceMappingURL=EnhanceSection.d.ts.map