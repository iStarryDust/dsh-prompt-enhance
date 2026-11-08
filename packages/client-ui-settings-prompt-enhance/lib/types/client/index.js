/**
 * Prompt-enhance settings page, browser half: registers the 增强提示词 section
 * once the settings shell's section slot is on the ledger. The switch and the
 * generation parameters ride the shared configuration form for the host
 * plugin's `prompt-enhance` namespace, and the prompt templates ride the
 * `promptEnhance` Remote namespace (soft-resolved at call time: the page
 * renders before or without the namespace).
 */
import { EnhanceSection } from "./EnhanceSection.js";
import { EnhanceSettingsController } from "./enhance-store.js";
import { en, zh } from "./locales.js";
export { EnhanceSection } from "./EnhanceSection.js";
export { EnhanceSettingsController, decodeEnhanceParams } from "./enhance-store.js";
/** Dictionary namespace owned by this plugin. */
const NS = 'settings.promptEnhance';
/** The host plugin entry whose configuration section holds the parameters. */
const HOST_ENTRY = 'prompt-enhance';
/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'configForms'];
/**
 * Register the prompt-enhance section and its dictionaries.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    const t = ctx.locale.bind(NS);
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-settings-prompt-enhance: dictionaries');
    const form = ctx.configForms.get(HOST_ENTRY);
    // The namespace is soft-resolved by its OWN dotted service name, and
    // resolved at CALL time: the namespace mounts asynchronously after this
    // plugin's apply, so an apply-time capture would freeze a pre-mount
    // undefined. Direct Remote calls answer the { ok, value | error } envelope,
    // so the adapter unwraps it into the raw face the controller expects.
    const unwrap = (envelope) => {
        const failure = envelope;
        if (typeof envelope !== 'object' || envelope === null || failure.ok !== true) {
            throw new Error(failure.error?.message ?? 'promptEnhance call failed');
        }
        return envelope.value;
    };
    const namespace = () => {
        try {
            return ctx.get('remote.promptEnhance');
        }
        catch {
            return undefined;
        }
    };
    // The official model catalog, soft-resolved the same way; the controller
    // flattens it into the override dropdown's choices.
    const loadCatalog = async () => {
        let session;
        try {
            session = ctx.get('remote.session');
        }
        catch {
            session = undefined;
        }
        if (session === undefined || typeof session.modelCatalog !== 'function') {
            throw new Error('the session Remote namespace is not mounted');
        }
        return unwrap(await session.modelCatalog());
    };
    const controller = new EnhanceSettingsController(form, () => {
        const remote = namespace();
        if (remote === undefined)
            return undefined;
        return {
            readTemplates: async () => unwrap(await remote.readTemplates()),
            writeTemplates: async (request) => unwrap(await remote.writeTemplates(request)),
            restoreTemplates: async () => unwrap(await remote.restoreTemplates()),
        };
    }, loadCatalog);
    ctx.effect(() => () => { controller.dispose(); }, 'ui-settings-prompt-enhance: form subscription');
    ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'prompt-enhance',
        // After memory (25): enhancement rewrites what memory helps compose.
        order: 26,
        label: () => t('nav'),
        locale: NS,
        inject: () => ({
            hooks: { enhanceSection: controller.store },
            toggleEnabled: (next) => controller.toggleEnabled(next),
            setParam: (field, value) => { controller.setParam(field, value); },
            saveParams: () => controller.saveParams(),
            loadModels: () => controller.loadModels(),
            setTemplate: (kind, text) => { controller.setTemplate(kind, text); },
            saveTemplates: () => controller.saveTemplates(),
            restoreTemplates: () => controller.restoreTemplates(),
            loadTemplates: () => controller.loadTemplates(),
        }),
    }, EnhanceSection));
}
//# sourceMappingURL=index.js.map