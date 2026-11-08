/**
 * Prompt-enhance settings section: the enable switch, the generation
 * parameters (the model override as a dropdown over the official model
 * catalog), and the two editable prompt templates. Visual language mirrors
 * the official settings sections: one column capped at 720px, an 18px title
 * over a tertiary intro, uppercase group heads, card rows built on the
 * settings-card tokens, and mono editors styled like the composition viewer.
 */
import { useEffect, useState } from 'react'
import { Button, Switch } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { EnhanceParams, EnhanceSectionState } from './enhance-store.ts'
import css from './EnhanceSection.module.css'

/** Settings actions and their shared controller state. */
export interface EnhanceSectionInjected {
  hooks: {
    /** Page snapshot bound by the renderer as useEnhanceSection. */
    enhanceSection: SnapshotStore<EnhanceSectionState>
  }
  /** Toggle the enable switch. */
  toggleEnabled: (next: boolean) => Promise<void>
  /** Update one parameter draft field. */
  setParam: <K extends keyof EnhanceParams>(field: K, value: EnhanceParams[K]) => void
  /** Save the parameter draft. */
  saveParams: () => Promise<void>
  /** Update one template draft. */
  setTemplate: (kind: 'system' | 'user', text: string) => void
  /** Save both template files. */
  saveTemplates: () => Promise<void>
  /** Restore both templates to the built-in defaults. */
  restoreTemplates: () => Promise<void>
  /** Load both templates into the editor. */
  loadTemplates: () => Promise<void>
  loadModels: () => Promise<void>
}

/** Props assembled by the settings renderer. */
export type EnhanceSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'settings.promptEnhance'>
  & InjectFace<EnhanceSectionInjected>

/**
 * Render the prompt-enhance settings section.
 * @param props - settings actions, snapshot hook, and localized copy.
 * @returns the section page.
 */
export function EnhanceSection({
  useEnhanceSection, toggleEnabled, setParam, saveParams, loadModels, setTemplate, saveTemplates, restoreTemplates, loadTemplates, t,
}: EnhanceSectionProps) {
  const state = useEnhanceSection(value => value)
  const [switchBusy, setSwitchBusy] = useState(false)
  const [switchFailed, setSwitchFailed] = useState(false)
  const [paramsBusy, setParamsBusy] = useState(false)
  const [templatesBusy, setTemplatesBusy] = useState(false)

  useEffect(() => { void loadModels() }, [loadModels])
  useEffect(() => { void loadTemplates() }, [loadTemplates])

  const disabled = state.status !== 'ready'
  const templates = state.templates
  const useSelect = state.modelsStatus === 'ready' && state.models.length > 0

  return (
    <section className={css.section}>
      <h2 className={css.title}>{t('nav')}</h2>
      <p className={css.intro}>{t('intro')}</p>
      {state.status === 'unavailable' && <p className={css.error} role="alert">{t('unavailable')}</p>}
      <section className={css.group}>
        <h3 className={css.groupHead}>{t('switchesGroup')}</h3>
        <ul className={css.rows}>
          <li className={css.rowCard}>
            <div className={css.rowText}>
              <span className={css.rowTitle}>{t('enabled.title')}</span>
              <span className={css.rowDesc}>{t('enabled.description')}</span>
              {switchFailed && <span className={css.error} role="alert">{t('writeFailed')}</span>}
            </div>
            <Switch
              checked={state.params.enabled}
              disabled={disabled || switchBusy}
              label={t('enabled.title')}
              onChange={(next) => {
                setSwitchFailed(false)
                setSwitchBusy(true)
                void toggleEnabled(next)
                  .catch(() => { setSwitchFailed(true) })
                  .finally(() => { setSwitchBusy(false) })
              }}
            />
          </li>
        </ul>
      </section>
      <section className={css.group}>
        <h3 className={css.groupHead}>{t('paramsGroup')}</h3>
        <div className={css.fields}>
          <div className={css.field}>
            <div className={css.fieldText}>
              <span className={css.rowTitle}>{t('overrideModel.title')}</span>
              <span className={css.rowDesc}>{t('overrideModel.description')}</span>
            </div>
            {useSelect ? (
              <select
                className={css.select}
                value={state.paramsDraft.overrideModel}
                disabled={disabled}
                onChange={(event) => { setParam('overrideModel', event.target.value) }}
              >
                <option value="">{t('overrideModel.follow')}</option>
                {state.models.map(choice => (
                  <option key={choice.value} value={choice.value}>{choice.label}</option>
                ))}
              </select>
            ) : (
              <div className={css.field} style={{ flex: 1, minWidth: 0 }}>
                <input
                  className={css.control}
                  type="text"
                  value={state.paramsDraft.overrideModel}
                  placeholder={state.modelsStatus === 'loading'
                    ? t('overrideModel.loading')
                    : state.modelsStatus === 'failed' ? t('overrideModel.loadFailed') : 'provider/model'}
                  spellCheck={false}
                  disabled={disabled}
                  onChange={(event) => { setParam('overrideModel', event.target.value) }}
                />
              </div>
            )}
          </div>
          <div className={css.field}>
            <div className={css.fieldText}>
              <span className={css.rowTitle}>{t('temperature.title')}</span>
              <span className={css.rowDesc}>{t('temperature.description')}</span>
            </div>
            <input
              className={css.control}
              type="number"
              min={0}
              max={2}
              step={0.1}
              value={state.paramsDraft.temperature}
              disabled={disabled}
              onChange={(event) => {
                const next = Number(event.target.value)
                if (Number.isFinite(next)) setParam('temperature', next)
              }}
            />
          </div>
          <div className={css.field}>
            <div className={css.fieldText}>
              <span className={css.rowTitle}>{t('maxTokens.title')}</span>
              <span className={css.rowDesc}>{t('maxTokens.description')}</span>
            </div>
            <input
              className={css.control}
              type="number"
              min={64}
              max={65536}
              step={1}
              value={state.paramsDraft.maxTokens}
              disabled={disabled}
              onChange={(event) => {
                const next = Number(event.target.value)
                if (Number.isFinite(next)) setParam('maxTokens', next)
              }}
            />
          </div>
          <div className={css.editorFooter}>
            <Button
              variant="primary"
              disabled={disabled || paramsBusy || !state.paramsDirty}
              onClick={() => {
                setParamsBusy(true)
                void saveParams().finally(() => { setParamsBusy(false) })
              }}
            >
              {state.paramsSaveState === 'saving' ? t('params.saving') : t('params.save')}
            </Button>
            {state.paramsSaveState === 'saved' && <span className={css.status} role="status">{t('params.saved')}</span>}
            {state.paramsSaveState === 'failed' && (
              <span className={css.error} role="alert">{state.paramsError ?? t('params.saveFailed')}</span>
            )}
          </div>
        </div>
      </section>
      <section className={css.group}>
        <h3 className={css.groupHead}>{t('templatesGroup')}</h3>
        <p className={css.rowDesc}>{t('templates.hint')}</p>
        <div className={css.fields}>
          <div>
            <div className={css.templateHead}>
              <h4 className={css.templateTitle}>{t('templates.system')}</h4>
              <span className={css.badge}>{templates.system.fromFile ? t('templates.fromFile') : t('templates.builtin')}</span>
            </div>
            <p className={css.path}>{templates.system.path}</p>
            <textarea
              className={css.editor}
              value={templates.system.text}
              spellCheck={false}
              disabled={disabled || templates.status === 'saving' || templates.status === 'loading'}
              onChange={(event) => { setTemplate('system', event.target.value) }}
            />
          </div>
          <div>
            <div className={css.templateHead}>
              <h4 className={css.templateTitle}>{t('templates.user')}</h4>
              <span className={css.badge}>{templates.user.fromFile ? t('templates.fromFile') : t('templates.builtin')}</span>
            </div>
            <p className={css.rowDesc}>{t('templates.userHint')}</p>
            <p className={css.path}>{templates.user.path}</p>
            <textarea
              className={css.editor}
              value={templates.user.text}
              spellCheck={false}
              disabled={disabled || templates.status === 'saving' || templates.status === 'loading'}
              onChange={(event) => { setTemplate('user', event.target.value) }}
            />
          </div>
          <div className={css.editorFooter}>
            <Button
              variant="primary"
              disabled={disabled || templatesBusy || templates.status === 'loading'}
              onClick={() => {
                setTemplatesBusy(true)
                void saveTemplates().finally(() => { setTemplatesBusy(false) })
              }}
            >
              {templates.status === 'saving' ? t('templates.saving') : t('templates.save')}
            </Button>
            <Button
              variant="outline"
              disabled={disabled || templatesBusy || templates.status === 'loading'}
              onClick={() => {
                setTemplatesBusy(true)
                void restoreTemplates().finally(() => { setTemplatesBusy(false) })
              }}
            >
              {t('templates.restore')}
            </Button>
            {templates.status === 'saved' && <span className={css.status} role="status">{t('templates.saved')}</span>}
            {templates.status === 'failed' && (
              <span className={css.error} role="alert">{templates.error ?? t('templates.saveFailed')}</span>
            )}
          </div>
        </div>
      </section>
    </section>
  )
}
