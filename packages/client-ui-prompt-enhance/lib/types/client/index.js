/**
 * Prompt-enhance surface, browser half: registers the composer's enhance
 * button in the `conversation.input.right` strip. The rewrite rides the
 * `promptEnhance` Remote namespace, soft-resolved at CALL time so the page
 * never waits for the namespace at apply; every other dependency is captured
 * once at apply (the closures never read ctx), which keeps the plugin
 * reinstall-safe.
 */
// Value import: the generated Remote contribution this plugin mounts so
// `ctx.remote.promptEnhance` resolves (third-party namespaces are not part of
// the official client assembly's mount list).
import { TYPERT_REMOTE } from '@istarry/dsh-prompt-enhance/remote';
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store';
import { EnhanceButton } from "./enhance-button.js";
import { en, zh } from "./locales.js";
export { EnhanceButton } from "./enhance-button.js";
/** Dictionary namespace owned by this plugin. */
const NS = 'promptEnhance';
/** The host plugin entry whose volatile config carries the enable switch. */
const HOST_ENTRY = 'prompt-enhance';
/** Required services (cordis fiber inject): all local, captured at apply. */
export const inject = ['slots', 'locale', 'sessions', 'conversation', 'configForms', 'modelDirectories', 'remote'];
/**
 * Register the enhance button and its dictionaries.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    const t = ctx.locale.bind(NS);
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-prompt-enhance: dictionaries');
    // Apply-time captures: local services resolved once (the closures touch
    // these, never ctx's service getters); the Remote namespace is the one
    // call-time soft lookup (`ctx.get('remote.promptEnhance')`), the same
    // discipline as the official third-party namespace consumers.
    const sessions = ctx.sessions;
    const modelDirectories = ctx.modelDirectories;
    const conversation = ctx.conversation;
    // The host plugin's volatile `enabled` switch through the shared
    // configuration form; an unmounted or disabled host hides the button.
    const form = ctx.configForms.get(HOST_ENTRY);
    const store = createSnapshotStore({ available: false, remoteReady: false, mountError: null });
    // Mount the generated Remote contribution: `ctx.get('remote.promptEnhance')`
    // resolves once this settles. The outcome is surfaced in the button state:
    // a failed mount is a configuration problem the tooltip must show.
    const mountFailed = (reason) => {
        store.set({ ...store.getSnapshot(), available: false, mountError: reason instanceof Error ? reason.message : String(reason) });
    };
    void ctx.remote.$mount(TYPERT_REMOTE).then(() => {
        store.set({ ...store.getSnapshot(), remoteReady: true });
    }, mountFailed);
    const derive = () => {
        const snapshot = form.getSnapshot();
        const value = snapshot.value;
        store.set({
            ...store.getSnapshot(),
            available: snapshot.status === 'ready' && value?.enabled !== false && store.getSnapshot().mountError === null,
        });
    };
    const unsubscribe = form.subscribe(derive);
    derive();
    ctx.effect(() => () => { unsubscribe(); }, 'ui-prompt-enhance: form subscription');
    ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
        name: 'conversation.input.right',
        id: 'prompt-enhance',
        order: 10,
        locale: NS,
        inject: (sessionId) => ({
            hooks: { enhanceConfig: store },
            enhance: async (text) => {
                // The session's current model; errors fall through to the empty
                // strings the host rejects with an actionable message.
                let provider = '';
                let model = '';
                try {
                    const current = modelDirectories.directoryFor(sessionId).store.getSnapshot().current;
                    provider = current?.provider ?? '';
                    model = current?.model ?? '';
                }
                catch { /* reported by the host as "no model available" */ }
                // Soft-resolve at call time through the DOTTED service name: the
                // namespace lives under `remote.promptEnhance` in fibers outside this
                // plugin's ancestor chain, so a property hop on the captured aggregate
                // re-enters the context proxy and throws on its inject snapshot —
                // `ctx.get('remote.promptEnhance')` is the only path that bypasses it
                // (same discipline as the official soft lookups).
                let namespace;
                try {
                    namespace = ctx.get('remote.promptEnhance');
                }
                catch {
                    namespace = undefined;
                }
                if (namespace === undefined || typeof namespace.enhance !== 'function') {
                    throw new Error(store.getSnapshot().mountError ?? t('error.unavailable'));
                }
                // Direct Remote calls answer the { ok, value | error } envelope; a
                // mounted-but-absent host surfaces here as a failed envelope.
                const envelope = await namespace.enhance({
                    text,
                    provider,
                    model,
                });
                const failure = envelope;
                if (typeof envelope !== 'object' || envelope === null || failure.ok !== true) {
                    throw new Error(failure.error?.message ?? t('error.unavailable'));
                }
                const value = envelope;
                return value.value?.text ?? '';
            },
            notify: (level, text) => {
                try {
                    const scope = sessions.scope(sessionId);
                    if (scope !== undefined)
                        conversation.input.for(scope).notify(level, text);
                }
                catch { /* the tooltip still carries the message */ }
            },
        }),
    }, EnhanceButton));
}
//# sourceMappingURL=index.js.map