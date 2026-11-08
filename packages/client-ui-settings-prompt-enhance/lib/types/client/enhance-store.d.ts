/**
 * Prompt-enhance settings page store: the switch and generation parameters
 * over the `prompt-enhance` configuration form (revision-fenced writes) and
 * the two prompt templates over the `promptEnhance` Remote namespace.
 *
 * Drafting rule: while a card is dirty the user's text wins; otherwise the
 * draft mirrors the live value, so the editor always shows what applies now
 * and keeps showing it after a save.
 */
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
/** The user-facing parameters; mirrors the host plugin's volatile Config. */
export interface EnhanceParams {
    /** Show the composer enhance button. */
    enabled: boolean;
    /** `provider/model` override; empty follows the session model. */
    overrideModel: string;
    /** Sampling temperature. */
    temperature: number;
    /** Output token cap. */
    maxTokens: number;
}
/** One accepted section; malformed durable values read as the defaults. */
export declare function decodeEnhanceParams(section: unknown): EnhanceParams;
/** One template as loaded from the Remote namespace. */
export interface TemplateDraft {
    /** Absolute file path (shown under the editor). */
    path: string;
    /** The effective text. */
    text: string;
    /** Whether the text came from the file rather than the built-in default. */
    fromFile: boolean;
}
/** Templates editor transient state. */
export interface EnhanceTemplatesState {
    /** The two template drafts plus their paths. */
    system: TemplateDraft;
    user: TemplateDraft;
    /** The prompts directory shown as the "edit these files" hint. */
    promptsDir: string;
    /** Load/save lifecycle of the templates card. */
    status: 'idle' | 'loading' | 'saving' | 'saved' | 'failed';
    /** Load or save failure text. */
    error: string | null;
}
/** One model choice in the override dropdown, flattened from the catalog. */
export interface EnhanceModelChoice {
    /** `provider/model` value written into the override parameter. */
    value: string;
    /** `Group · Model` display label. */
    label: string;
}
/** Page snapshot rendered by the section. */
export interface EnhanceSectionState {
    /** Switch transport state; `unavailable` renders the controls disabled. */
    status: 'loading' | 'ready' | 'unavailable';
    /** The parameters as the Host holds them. */
    params: EnhanceParams;
    /** Parameter editor draft plus dirty flag. */
    paramsDraft: EnhanceParams;
    paramsDirty: boolean;
    paramsSaveState: 'idle' | 'saving' | 'saved' | 'failed';
    paramsError: string | null;
    /** Official catalog flattened into dropdown choices. */
    models: EnhanceModelChoice[];
    /** Catalog load lifecycle; `ready` turns the override into a dropdown. */
    modelsStatus: 'idle' | 'loading' | 'ready' | 'failed';
    /** The templates editor. */
    templates: EnhanceTemplatesState;
}
/** The `promptEnhance` Remote namespace face the templates card uses. */
export interface EnhanceRemote {
    /** Read both templates and their prompts directory. */
    readTemplates(): Promise<{
        promptsDir: string;
        system: TemplateDraft;
        user: TemplateDraft;
    }>;
    /** Write both template files. */
    writeTemplates(request: {
        system: string;
        user: string;
    }): Promise<{
        promptsDir: string;
        system: TemplateDraft;
        user: TemplateDraft;
    }>;
    /** Restore both template files to the built-in defaults. */
    restoreTemplates(): Promise<{
        promptsDir: string;
        system: TemplateDraft;
        user: TemplateDraft;
    }>;
}
/** One settings-page controller (one per browser page). */
export declare class EnhanceSettingsController {
    private readonly form;
    private readonly resolveRemote;
    private readonly loadCatalog;
    /** Snapshot the section renderer subscribes to. */
    readonly store: SnapshotStore<EnhanceSectionState>;
    private readonly unsubscribe;
    /**
     * @param form - the shared configuration form for the `prompt-enhance`
     * namespace (parameter state and ordered writes).
     * @param resolveRemote - resolves the `promptEnhance` Remote namespace at
     * CALL time: the namespace mounts asynchronously after this plugin's own
     * apply, so an apply-time capture would freeze a pre-mount undefined.
     * @param loadCatalog - reads the official session model catalog at CALL
     * time, flattened here into dropdown choices.
     */
    constructor(form: ConfigForm<EnhanceParams>, resolveRemote: () => EnhanceRemote | undefined, loadCatalog: () => Promise<{
        groups: readonly {
            id: string;
            name: string;
            models: readonly {
                id: string;
                name: string;
            }[];
        }[];
    }>);
    /** Release the form subscription. */
    dispose(): void;
    /** Load the official model catalog into the dropdown choices. */
    loadModels(): Promise<void>;
    /** Toggle the enable switch through the shared configuration form. */
    toggleEnabled(next: boolean): Promise<void>;
    /** Update one parameter draft field (client-side until saved). */
    setParam<K extends keyof EnhanceParams>(field: K, value: EnhanceParams[K]): void;
    /** Save the parameter draft through the configuration form. */
    saveParams(): Promise<void>;
    /** Update one template draft (client-side until saved). */
    setTemplate(kind: 'system' | 'user', text: string): void;
    /** Load both templates from the Remote namespace into the editor. */
    loadTemplates(): Promise<void>;
    /** Save both template files through the Remote namespace. */
    saveTemplates(): Promise<void>;
    /** Restore both templates to the built-in defaults (writes the files). */
    restoreTemplates(): Promise<void>;
    private failTemplates;
    private deriveParams;
}
//# sourceMappingURL=enhance-store.d.ts.map