/**
 * Prompt-enhance settings page store: the switch and generation parameters
 * over the `prompt-enhance` configuration form (revision-fenced writes) and
 * the two prompt templates over the `promptEnhance` Remote namespace.
 *
 * Drafting rule: while a card is dirty the user's text wins; otherwise the
 * draft mirrors the live value, so the editor always shows what applies now
 * and keeps showing it after a save.
 */

import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import { createSnapshotStore, type SnapshotStore } from '@deepseek-ai/dsh-client-store'

/** The user-facing parameters; mirrors the host plugin's volatile Config. */
export interface EnhanceParams {
  /** Show the composer enhance button. */
  enabled: boolean
  /** `provider/model` override; empty follows the session model. */
  overrideModel: string
  /** Sampling temperature. */
  temperature: number
  /** Output token cap. */
  maxTokens: number
}

/** One accepted section; malformed durable values read as the defaults. */
export function decodeEnhanceParams(section: unknown): EnhanceParams {
  const source = typeof section === 'object' && section !== null && !Array.isArray(section)
    ? section as Record<string, unknown>
    : {}
  return {
    enabled: source.enabled !== false,
    overrideModel: typeof source.overrideModel === 'string' ? source.overrideModel : '',
    temperature: typeof source.temperature === 'number' && Number.isFinite(source.temperature) ? source.temperature : 0.7,
    maxTokens: typeof source.maxTokens === 'number' && Number.isFinite(source.maxTokens) ? source.maxTokens : 2048,
  }
}

/** One template as loaded from the Remote namespace. */
export interface TemplateDraft {
  /** Absolute file path (shown under the editor). */
  path: string
  /** The effective text. */
  text: string
  /** Whether the text came from the file rather than the built-in default. */
  fromFile: boolean
}

/** Templates editor transient state. */
export interface EnhanceTemplatesState {
  /** The two template drafts plus their paths. */
  system: TemplateDraft
  user: TemplateDraft
  /** The prompts directory shown as the "edit these files" hint. */
  promptsDir: string
  /** Load/save lifecycle of the templates card. */
  status: 'idle' | 'loading' | 'saving' | 'saved' | 'failed'
  /** Load or save failure text. */
  error: string | null
}

/** One model choice in the override dropdown, flattened from the catalog. */
export interface EnhanceModelChoice {
  /** `provider/model` value written into the override parameter. */
  value: string
  /** `Group · Model` display label. */
  label: string
}

/** Page snapshot rendered by the section. */
export interface EnhanceSectionState {
  /** Switch transport state; `unavailable` renders the controls disabled. */
  status: 'loading' | 'ready' | 'unavailable'
  /** The parameters as the Host holds them. */
  params: EnhanceParams
  /** Parameter editor draft plus dirty flag. */
  paramsDraft: EnhanceParams
  paramsDirty: boolean
  paramsSaveState: 'idle' | 'saving' | 'saved' | 'failed'
  paramsError: string | null
  /** Official catalog flattened into dropdown choices. */
  models: EnhanceModelChoice[]
  /** Catalog load lifecycle; `ready` turns the override into a dropdown. */
  modelsStatus: 'idle' | 'loading' | 'ready' | 'failed'
  /** The templates editor. */
  templates: EnhanceTemplatesState
}

/** The `promptEnhance` Remote namespace face the templates card uses. */
export interface EnhanceRemote {
  /** Read both templates and their prompts directory. */
  readTemplates(): Promise<{ promptsDir: string; system: TemplateDraft; user: TemplateDraft }>
  /** Write both template files. */
  writeTemplates(request: { system: string; user: string }): Promise<{ promptsDir: string; system: TemplateDraft; user: TemplateDraft }>
  /** Restore both template files to the built-in defaults. */
  restoreTemplates(): Promise<{ promptsDir: string; system: TemplateDraft; user: TemplateDraft }>
}

/** One settings-page controller (one per browser page). */
export class EnhanceSettingsController {
  /** Snapshot the section renderer subscribes to. */
  readonly store: SnapshotStore<EnhanceSectionState> = createSnapshotStore<EnhanceSectionState>({
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
  })

  private readonly unsubscribe: () => void

  /**
   * @param form - the shared configuration form for the `prompt-enhance`
   * namespace (parameter state and ordered writes).
   * @param resolveRemote - resolves the `promptEnhance` Remote namespace at
   * CALL time: the namespace mounts asynchronously after this plugin's own
   * apply, so an apply-time capture would freeze a pre-mount undefined.
   * @param loadCatalog - reads the official session model catalog at CALL
   * time, flattened here into dropdown choices.
   */
  constructor(
    private readonly form: ConfigForm<EnhanceParams>,
    private readonly resolveRemote: () => EnhanceRemote | undefined,
    private readonly loadCatalog: () => Promise<{ groups: readonly { id: string; name: string; models: readonly { id: string; name: string }[] }[] }>,
  ) {
    this.unsubscribe = form.subscribe(() => { this.deriveParams() })
    this.deriveParams()
  }

  /** Release the form subscription. */
  dispose(): void {
    this.unsubscribe()
  }

  /** Load the official model catalog into the dropdown choices. */
  async loadModels(): Promise<void> {
    this.store.set({
      ...this.store.getSnapshot(),
      modelsStatus: 'loading',
    })
    try {
      const models = (await this.loadCatalog()).groups.flatMap(group =>
        group.models.map(model => ({
          value: `${group.id}/${model.id}`,
          label: `${group.name} · ${model.name}`,
        })))
      this.store.set({
        ...this.store.getSnapshot(),
        models,
        modelsStatus: 'ready',
      })
    } catch {
      this.store.set({
        ...this.store.getSnapshot(),
        models: [],
        modelsStatus: 'failed',
      })
    }
  }

  /** Toggle the enable switch through the shared configuration form. */
  async toggleEnabled(next: boolean): Promise<void> {
    await this.form.set('enabled', next)
  }

  /** Update one parameter draft field (client-side until saved). */
  setParam<K extends keyof EnhanceParams>(field: K, value: EnhanceParams[K]): void {
    const snapshot = this.store.getSnapshot()
    this.store.set({
      ...snapshot,
      paramsDraft: { ...snapshot.paramsDraft, [field]: value },
      paramsDirty: true,
      paramsSaveState: 'idle',
    })
  }

  /** Save the parameter draft through the configuration form. */
  async saveParams(): Promise<void> {
    const { paramsDraft } = this.store.getSnapshot()
    this.store.set({ ...this.store.getSnapshot(), paramsSaveState: 'saving', paramsError: null })
    try {
      await this.form.set('overrideModel', paramsDraft.overrideModel)
      await this.form.set('temperature', paramsDraft.temperature)
      await this.form.set('maxTokens', paramsDraft.maxTokens)
      this.store.set({
        ...this.store.getSnapshot(),
        paramsDirty: false,
        paramsSaveState: 'saved',
        paramsError: null,
      })
      this.deriveParams()
    } catch (error) {
      this.store.set({
        ...this.store.getSnapshot(),
        paramsSaveState: 'failed',
        paramsError: error instanceof Error ? error.message : String(error),
      })
    }
  }
  /** Update one template draft (client-side until saved). */
  setTemplate(kind: 'system' | 'user', text: string): void {
    const snapshot = this.store.getSnapshot()
    this.store.set({
      ...snapshot,
      templates: {
        ...snapshot.templates,
        [kind]: { ...snapshot.templates[kind], text },
        status: 'idle',
      },
    })
  }

  /** Load both templates from the Remote namespace into the editor. */
  async loadTemplates(): Promise<void> {
    const remote = this.resolveRemote()
    if (remote === undefined) {
      this.failTemplates('promptEnhance namespace is not mounted')
      return
    }
    this.store.set({
      ...this.store.getSnapshot(),
      templates: { ...this.store.getSnapshot().templates, status: 'loading', error: null },
    })
    try {
      const read = await remote.readTemplates()
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
      })
    } catch (error) {
      this.failTemplates(error instanceof Error ? error.message : String(error))
    }
  }

  /** Save both template files through the Remote namespace. */
  async saveTemplates(): Promise<void> {
    const remote = this.resolveRemote()
    if (remote === undefined) {
      this.failTemplates('promptEnhance namespace is not mounted')
      return
    }
    const { system, user } = this.store.getSnapshot().templates
    this.store.set({
      ...this.store.getSnapshot(),
      templates: { ...this.store.getSnapshot().templates, status: 'saving', error: null },
    })
    try {
      const written = await remote.writeTemplates({ system: system.text, user: user.text })
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
      })
    } catch (error) {
      this.failTemplates(error instanceof Error ? error.message : String(error))
    }
  }

  /** Restore both templates to the built-in defaults (writes the files). */
  async restoreTemplates(): Promise<void> {
    const remote = this.resolveRemote()
    if (remote === undefined) {
      this.failTemplates('promptEnhance namespace is not mounted')
      return
    }
    this.store.set({
      ...this.store.getSnapshot(),
      templates: { ...this.store.getSnapshot().templates, status: 'saving', error: null },
    })
    try {
      const restored = await remote.restoreTemplates()
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
      })
    } catch (error) {
      this.failTemplates(error instanceof Error ? error.message : String(error))
    }
  }

  private failTemplates(message: string): void {
    this.store.set({
      ...this.store.getSnapshot(),
      templates: { ...this.store.getSnapshot().templates, status: 'failed', error: message },
    })
  }

  private deriveParams(): void {
    const snapshot = this.form.getSnapshot()
    const live = snapshot.value === undefined ? decodeEnhanceParams(undefined) : decodeEnhanceParams(snapshot.value)
    const current = this.store.getSnapshot()
    this.store.set({
      ...current,
      status: snapshot.status === 'ready' ? 'ready' : snapshot.status === 'loading' ? 'loading' : 'unavailable',
      params: live,
      // While the editor is dirty the user's text wins; otherwise mirror the
      // live values so the fields always show what applies now.
      paramsDraft: current.paramsDirty ? current.paramsDraft : live,
    })
  }
}
