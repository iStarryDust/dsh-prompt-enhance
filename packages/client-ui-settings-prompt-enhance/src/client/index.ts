/**
 * Prompt-enhance settings page, browser half: registers the 增强提示词 section
 * once the settings shell's section slot is on the ledger. The switch and the
 * generation parameters ride the shared configuration form for the host
 * plugin's `prompt-enhance` namespace, and the prompt templates ride the
 * `promptEnhance` Remote namespace (soft-resolved at call time: the page
 * renders before or without the namespace).
 */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
// Type-only: pulls the locale plugin's Context merge (ctx.locale).
import type {} from '@deepseek-ai/dsh-client-locale/client'
// Type-only: pulls the ctx.remote merge (the promptEnhance namespace).
import type {} from '@deepseek-ai/dsh-api-remotes/client'
// Type-only: pulls the settings shell's SlotMap merge (the 'settings.section'
// entry) and the configForms service.
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { EnhanceSection } from './EnhanceSection.tsx'
import type { EnhanceSectionInjected } from './EnhanceSection.tsx'
import { EnhanceSettingsController } from './enhance-store.ts'
import type { EnhanceParams, EnhanceRemote } from './enhance-store.ts'
import { en, zh, type PromptEnhanceSettingsKey } from './locales.ts'

export { EnhanceSection } from './EnhanceSection.tsx'
export type { EnhanceSectionInjected, EnhanceSectionProps } from './EnhanceSection.tsx'
export { EnhanceSettingsController, decodeEnhanceParams } from './enhance-store.ts'
export type { EnhanceParams, EnhanceRemote, EnhanceSectionState, EnhanceTemplatesState } from './enhance-store.ts'
export type { PromptEnhanceSettingsKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The prompt-enhance settings page copy. */
    'settings.promptEnhance': PromptEnhanceSettingsKey
  }
}

/** Dictionary namespace owned by this plugin. */
const NS = 'settings.promptEnhance'

/** One templates read as the controller expects it. */
type EnhanceRemoteRead = EnhanceRemote extends { readTemplates(): infer P } ? Awaited<P> : never

/** The host plugin entry whose configuration section holds the parameters. */
const HOST_ENTRY = 'prompt-enhance'

/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'configForms']

/**
 * Register the prompt-enhance section and its dictionaries.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  const t = ctx.locale.bind(NS)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-settings-prompt-enhance: dictionaries')

  const form = ctx.configForms.get<EnhanceParams>(HOST_ENTRY)
  // The namespace is soft-resolved by its OWN dotted service name, and
  // resolved at CALL time: the namespace mounts asynchronously after this
  // plugin's apply, so an apply-time capture would freeze a pre-mount
  // undefined. Direct Remote calls answer the { ok, value | error } envelope,
  // so the adapter unwraps it into the raw face the controller expects.
  const unwrap = <T>(envelope: unknown): T => {
    const failure = envelope as { ok?: boolean; error?: { message?: string } }
    if (typeof envelope !== 'object' || envelope === null || failure.ok !== true) {
      throw new Error(failure.error?.message ?? 'promptEnhance call failed')
    }
    return (envelope as { value?: T }).value as T
  }
  type RawNamespace = {
    readTemplates(): Promise<unknown>
    writeTemplates(request: { system: string; user: string }): Promise<unknown>
    restoreTemplates(): Promise<unknown>
  }
  const namespace = (): RawNamespace | undefined => {
    try {
      return ctx.get('remote.promptEnhance') as RawNamespace | undefined
    } catch {
      return undefined
    }
  }
  // The official model catalog, soft-resolved the same way; the controller
  // flattens it into the override dropdown's choices.
  const loadCatalog = async (): Promise<{ groups: readonly { id: string; name: string; models: readonly { id: string; name: string }[] }[] }> => {
    let session: { modelCatalog(): Promise<unknown> } | undefined
    try {
      session = ctx.get('remote.session') as { modelCatalog(): Promise<unknown> } | undefined
    } catch {
      session = undefined
    }
    if (session === undefined || typeof session.modelCatalog !== 'function') {
      throw new Error('the session Remote namespace is not mounted')
    }
    return unwrap(await session.modelCatalog())
  }
  const controller = new EnhanceSettingsController(form, () => {
    const remote = namespace()
    if (remote === undefined) return undefined
    return {
      readTemplates: async () => unwrap<EnhanceRemoteRead>(await remote.readTemplates()),
      writeTemplates: async (request) => unwrap<EnhanceRemoteRead>(await remote.writeTemplates(request)),
      restoreTemplates: async () => unwrap<EnhanceRemoteRead>(await remote.restoreTemplates()),
    }
  }, loadCatalog)
  ctx.effect(() => () => { controller.dispose() }, 'ui-settings-prompt-enhance: form subscription')

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'prompt-enhance',
    // After memory (25): enhancement rewrites what memory helps compose.
    order: 26,
    label: () => t('nav'),
    locale: NS,
    inject: (): EnhanceSectionInjected => ({
      hooks: { enhanceSection: controller.store },
      toggleEnabled: (next) => controller.toggleEnabled(next),
      setParam: (field, value) => { controller.setParam(field, value) },
      saveParams: () => controller.saveParams(),
      loadModels: () => controller.loadModels(),
      setTemplate: (kind, text) => { controller.setTemplate(kind, text) },
      saveTemplates: () => controller.saveTemplates(),
      restoreTemplates: () => controller.restoreTemplates(),
      loadTemplates: () => controller.loadTemplates(),
    }),
  }, EnhanceSection))
}
