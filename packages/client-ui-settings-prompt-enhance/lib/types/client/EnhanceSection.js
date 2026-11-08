import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Prompt-enhance settings section: the enable switch, the generation
 * parameters (the model override as a dropdown over the official model
 * catalog), and the two editable prompt templates. Visual language mirrors
 * the official settings sections: one column capped at 720px, an 18px title
 * over a tertiary intro, uppercase group heads, card rows built on the
 * settings-card tokens, and mono editors styled like the composition viewer.
 */
import { useEffect, useState } from 'react';
import { Button, Switch } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './EnhanceSection.module.css';
/**
 * Render the prompt-enhance settings section.
 * @param props - settings actions, snapshot hook, and localized copy.
 * @returns the section page.
 */
export function EnhanceSection({ useEnhanceSection, toggleEnabled, setParam, saveParams, loadModels, setTemplate, saveTemplates, restoreTemplates, loadTemplates, t, }) {
    const state = useEnhanceSection(value => value);
    const [switchBusy, setSwitchBusy] = useState(false);
    const [switchFailed, setSwitchFailed] = useState(false);
    const [paramsBusy, setParamsBusy] = useState(false);
    const [templatesBusy, setTemplatesBusy] = useState(false);
    useEffect(() => { void loadModels(); }, [loadModels]);
    useEffect(() => { void loadTemplates(); }, [loadTemplates]);
    const disabled = state.status !== 'ready';
    const templates = state.templates;
    const useSelect = state.modelsStatus === 'ready' && state.models.length > 0;
    return (_jsxs("section", { className: css.section, children: [_jsx("h2", { className: css.title, children: t('nav') }), _jsx("p", { className: css.intro, children: t('intro') }), state.status === 'unavailable' && _jsx("p", { className: css.error, role: "alert", children: t('unavailable') }), _jsxs("section", { className: css.group, children: [_jsx("h3", { className: css.groupHead, children: t('switchesGroup') }), _jsx("ul", { className: css.rows, children: _jsxs("li", { className: css.rowCard, children: [_jsxs("div", { className: css.rowText, children: [_jsx("span", { className: css.rowTitle, children: t('enabled.title') }), _jsx("span", { className: css.rowDesc, children: t('enabled.description') }), switchFailed && _jsx("span", { className: css.error, role: "alert", children: t('writeFailed') })] }), _jsx(Switch, { checked: state.params.enabled, disabled: disabled || switchBusy, label: t('enabled.title'), onChange: (next) => {
                                        setSwitchFailed(false);
                                        setSwitchBusy(true);
                                        void toggleEnabled(next)
                                            .catch(() => { setSwitchFailed(true); })
                                            .finally(() => { setSwitchBusy(false); });
                                    } })] }) })] }), _jsxs("section", { className: css.group, children: [_jsx("h3", { className: css.groupHead, children: t('paramsGroup') }), _jsxs("div", { className: css.fields, children: [_jsxs("div", { className: css.field, children: [_jsxs("div", { className: css.fieldText, children: [_jsx("span", { className: css.rowTitle, children: t('overrideModel.title') }), _jsx("span", { className: css.rowDesc, children: t('overrideModel.description') })] }), useSelect ? (_jsxs("select", { className: css.select, value: state.paramsDraft.overrideModel, disabled: disabled, onChange: (event) => { setParam('overrideModel', event.target.value); }, children: [_jsx("option", { value: "", children: t('overrideModel.follow') }), state.models.map(choice => (_jsx("option", { value: choice.value, children: choice.label }, choice.value)))] })) : (_jsx("div", { className: css.field, style: { flex: 1, minWidth: 0 }, children: _jsx("input", { className: css.control, type: "text", value: state.paramsDraft.overrideModel, placeholder: state.modelsStatus === 'loading'
                                                ? t('overrideModel.loading')
                                                : state.modelsStatus === 'failed' ? t('overrideModel.loadFailed') : 'provider/model', spellCheck: false, disabled: disabled, onChange: (event) => { setParam('overrideModel', event.target.value); } }) }))] }), _jsxs("div", { className: css.field, children: [_jsxs("div", { className: css.fieldText, children: [_jsx("span", { className: css.rowTitle, children: t('temperature.title') }), _jsx("span", { className: css.rowDesc, children: t('temperature.description') })] }), _jsx("input", { className: css.control, type: "number", min: 0, max: 2, step: 0.1, value: state.paramsDraft.temperature, disabled: disabled, onChange: (event) => {
                                            const next = Number(event.target.value);
                                            if (Number.isFinite(next))
                                                setParam('temperature', next);
                                        } })] }), _jsxs("div", { className: css.field, children: [_jsxs("div", { className: css.fieldText, children: [_jsx("span", { className: css.rowTitle, children: t('maxTokens.title') }), _jsx("span", { className: css.rowDesc, children: t('maxTokens.description') })] }), _jsx("input", { className: css.control, type: "number", min: 64, max: 65536, step: 1, value: state.paramsDraft.maxTokens, disabled: disabled, onChange: (event) => {
                                            const next = Number(event.target.value);
                                            if (Number.isFinite(next))
                                                setParam('maxTokens', next);
                                        } })] }), _jsxs("div", { className: css.editorFooter, children: [_jsx(Button, { variant: "primary", disabled: disabled || paramsBusy || !state.paramsDirty, onClick: () => {
                                            setParamsBusy(true);
                                            void saveParams().finally(() => { setParamsBusy(false); });
                                        }, children: state.paramsSaveState === 'saving' ? t('params.saving') : t('params.save') }), state.paramsSaveState === 'saved' && _jsx("span", { className: css.status, role: "status", children: t('params.saved') }), state.paramsSaveState === 'failed' && (_jsx("span", { className: css.error, role: "alert", children: state.paramsError ?? t('params.saveFailed') }))] })] })] }), _jsxs("section", { className: css.group, children: [_jsx("h3", { className: css.groupHead, children: t('templatesGroup') }), _jsx("p", { className: css.rowDesc, children: t('templates.hint') }), _jsxs("div", { className: css.fields, children: [_jsxs("div", { children: [_jsxs("div", { className: css.templateHead, children: [_jsx("h4", { className: css.templateTitle, children: t('templates.system') }), _jsx("span", { className: css.badge, children: templates.system.fromFile ? t('templates.fromFile') : t('templates.builtin') })] }), _jsx("p", { className: css.path, children: templates.system.path }), _jsx("textarea", { className: css.editor, value: templates.system.text, spellCheck: false, disabled: disabled || templates.status === 'saving' || templates.status === 'loading', onChange: (event) => { setTemplate('system', event.target.value); } })] }), _jsxs("div", { children: [_jsxs("div", { className: css.templateHead, children: [_jsx("h4", { className: css.templateTitle, children: t('templates.user') }), _jsx("span", { className: css.badge, children: templates.user.fromFile ? t('templates.fromFile') : t('templates.builtin') })] }), _jsx("p", { className: css.rowDesc, children: t('templates.userHint') }), _jsx("p", { className: css.path, children: templates.user.path }), _jsx("textarea", { className: css.editor, value: templates.user.text, spellCheck: false, disabled: disabled || templates.status === 'saving' || templates.status === 'loading', onChange: (event) => { setTemplate('user', event.target.value); } })] }), _jsxs("div", { className: css.editorFooter, children: [_jsx(Button, { variant: "primary", disabled: disabled || templatesBusy || templates.status === 'loading', onClick: () => {
                                            setTemplatesBusy(true);
                                            void saveTemplates().finally(() => { setTemplatesBusy(false); });
                                        }, children: templates.status === 'saving' ? t('templates.saving') : t('templates.save') }), _jsx(Button, { variant: "outline", disabled: disabled || templatesBusy || templates.status === 'loading', onClick: () => {
                                            setTemplatesBusy(true);
                                            void restoreTemplates().finally(() => { setTemplatesBusy(false); });
                                        }, children: t('templates.restore') }), templates.status === 'saved' && _jsx("span", { className: css.status, role: "status", children: t('templates.saved') }), templates.status === 'failed' && (_jsx("span", { className: css.error, role: "alert", children: templates.error ?? t('templates.saveFailed') }))] })] })] })] }));
}
//# sourceMappingURL=EnhanceSection.js.map