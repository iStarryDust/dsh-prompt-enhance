/**
 * Prompt-enhance settings page store: the switch and generation parameters
 * over the `prompt-enhance` configuration form (revision-fenced writes) and
 * the two prompt templates over the `promptEnhance` Remote namespace.
 *
 * Drafting rule: while a card is dirty the user's text wins; otherwise the
 * draft mirrors the live value, so the editor always shows what applies now
 * and keeps showing it after a save.
 */
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store';
/** One accepted section; malformed durable values read as the defaults. */
export function decodeEnhanceParams(section) {
    const source = typeof section === 'object' && section !== null && !Array.isArray(section)
        ? section
        : {};
    return {
        enabled: source.enabled !== false,
        overrideModel: typeof source.overrideModel === 'string' ? source.overrideModel : '',
        temperature: typeof source.temperature === 'number' && Number.isFinite(source.temperature) ? source.temperature : 0.7,
        maxTokens: typeof source.maxTokens === 'number' && Number.isFinite(source.maxTokens) ? source.maxTokens : 2048,
    };
}
/** One settings-page controller (one per browser page). */
export class EnhanceSettingsController {
    form;
    resolveRemote;
    loadCatalog;
    /** Snapshot the section renderer subscribes to. */
    store = createSnapshotStore({
        status: 'loading',
        params: decodeEnhanceParams(undefined),
        paramsDraft: decodeEnhanceParams(undefined),
        paramsDirty: false,
        paramsSaveState: 'idle',
        paramsError: null,
        models: [],
        modelsStatus: 'idle',
        templates: {
            system: { path: '', text: '', fromFile: false },
            user: { path: '', text: '', fromFile: false },
            promptsDir: '',
            status: 'idle',
            error: null,
        },
    });
    unsubscribe;
    /**
     * @param form - the shared configuration form for the `prompt-enhance`
     * namespace (parameter state and ordered writes).
     * @param resolveRemote - resolves the `promptEnhance` Remote namespace at
     * CALL time: the namespace mounts asynchronously after this plugin's own
     * apply, so an apply-time capture would freeze a pre-mount undefined.
     * @param loadCatalog - reads the official session model catalog at CALL
     * time, flattened here into dropdown choices.
     */
    constructor(form, resolveRemote, loadCatalog) {
        this.form = form;
        this.resolveRemote = resolveRemote;
        this.loadCatalog = loadCatalog;
        this.unsubscribe = form.subscribe(() => { this.deriveParams(); });
        this.deriveParams();
    }
    /** Release the form subscription. */
    dispose() {
        this.unsubscribe();
    }
    /** Load the official model catalog into the dropdown choices. */
    async loadModels() {
        this.store.set({
            ...this.store.getSnapshot(),
            modelsStatus: 'loading',
        });
        try {
            const models = (await this.loadCatalog()).groups.flatMap(group => group.models.map(model => ({
                value: `${group.id}/${model.id}`,
                label: `${group.name} · ${model.name}`,
            })));
            this.store.set({
                ...this.store.getSnapshot(),
                models,
                modelsStatus: 'ready',
            });
        }
        catch {
            this.store.set({
                ...this.store.getSnapshot(),
                models: [],
                modelsStatus: 'failed',
            });
        }
    }
    /** Toggle the enable switch through the shared configuration form. */
    async toggleEnabled(next) {
        await this.form.set('enabled', next);
    }
    /** Update one parameter draft field (client-side until saved). */
    setParam(field, value) {
        const snapshot = this.store.getSnapshot();
        this.store.set({
            ...snapshot,
            paramsDraft: { ...snapshot.paramsDraft, [field]: value },
            paramsDirty: true,
            paramsSaveState: 'idle',
        });
    }
    /** Save the parameter draft through the configuration form. */
    async saveParams() {
        const { paramsDraft } = this.store.getSnapshot();
        this.store.set({ ...this.store.getSnapshot(), paramsSaveState: 'saving', paramsError: null });
        try {
            await this.form.set('overrideModel', paramsDraft.overrideModel);
            await this.form.set('temperature', paramsDraft.temperature);
            await this.form.set('maxTokens', paramsDraft.maxTokens);
            this.store.set({
                ...this.store.getSnapshot(),
                paramsDirty: false,
                paramsSaveState: 'saved',
                paramsError: null,
            });
            this.deriveParams();
        }
        catch (error) {
            this.store.set({
                ...this.store.getSnapshot(),
                paramsSaveState: 'failed',
                paramsError: error instanceof Error ? error.message : String(error),
            });
        }
    }
    /** Update one template draft (client-side until saved). */
    setTemplate(kind, text) {
        const snapshot = this.store.getSnapshot();
        this.store.set({
            ...snapshot,
            templates: {
                ...snapshot.templates,
                [kind]: { ...snapshot.templates[kind], text },
                status: 'idle',
            },
        });
    }
    /** Load both templates from the Remote namespace into the editor. */
    async loadTemplates() {
        const remote = this.resolveRemote();
        if (remote === undefined) {
            this.failTemplates('promptEnhance namespace is not mounted');
            return;
        }
        this.store.set({
            ...this.store.getSnapshot(),
            templates: { ...this.store.getSnapshot().templates, status: 'loading', error: null },
        });
        try {
            const read = await remote.readTemplates();
            this.store.set({
                ...this.store.getSnapshot(),
                templates: {
                    ...this.store.getSnapshot().templates,
                    system: read.system,
                    user: read.user,
                    promptsDir: read.promptsDir,
                    status: 'idle',
                    error: null,
                },
            });
        }
        catch (error) {
            this.failTemplates(error instanceof Error ? error.message : String(error));
        }
    }
    /** Save both template files through the Remote namespace. */
    async saveTemplates() {
        const remote = this.resolveRemote();
        if (remote === undefined) {
            this.failTemplates('promptEnhance namespace is not mounted');
            return;
        }
        const { system, user } = this.store.getSnapshot().templates;
        this.store.set({
            ...this.store.getSnapshot(),
            templates: { ...this.store.getSnapshot().templates, status: 'saving', error: null },
        });
        try {
            const written = await remote.writeTemplates({ system: system.text, user: user.text });
            this.store.set({
                ...this.store.getSnapshot(),
                templates: {
                    ...this.store.getSnapshot().templates,
                    system: written.system,
                    user: written.user,
                    promptsDir: written.promptsDir,
                    status: 'saved',
                    error: null,
                },
            });
        }
        catch (error) {
            this.failTemplates(error instanceof Error ? error.message : String(error));
        }
    }
    /** Restore both templates to the built-in defaults (writes the files). */
    async restoreTemplates() {
        const remote = this.resolveRemote();
        if (remote === undefined) {
            this.failTemplates('promptEnhance namespace is not mounted');
            return;
        }
        this.store.set({
            ...this.store.getSnapshot(),
            templates: { ...this.store.getSnapshot().templates, status: 'saving', error: null },
        });
        try {
            const restored = await remote.restoreTemplates();
            this.store.set({
                ...this.store.getSnapshot(),
                templates: {
                    ...this.store.getSnapshot().templates,
                    system: restored.system,
                    user: restored.user,
                    promptsDir: restored.promptsDir,
                    status: 'saved',
                    error: null,
                },
            });
        }
        catch (error) {
            this.failTemplates(error instanceof Error ? error.message : String(error));
        }
    }
    failTemplates(message) {
        this.store.set({
            ...this.store.getSnapshot(),
            templates: { ...this.store.getSnapshot().templates, status: 'failed', error: message },
        });
    }
    deriveParams() {
        const snapshot = this.form.getSnapshot();
        const live = snapshot.value === undefined ? decodeEnhanceParams(undefined) : decodeEnhanceParams(snapshot.value);
        const current = this.store.getSnapshot();
        this.store.set({
            ...current,
            status: snapshot.status === 'ready' ? 'ready' : snapshot.status === 'loading' ? 'loading' : 'unavailable',
            params: live,
            // While the editor is dirty the user's text wins; otherwise mirror the
            // live values so the fields always show what applies now.
            paramsDraft: current.paramsDirty ? current.paramsDraft : live,
        });
    }
}
//# sourceMappingURL=enhance-store.js.map