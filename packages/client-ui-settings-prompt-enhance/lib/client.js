window.__ModuleLoader__.load({
	id: "@istarry/dsh-client-ui-settings-prompt-enhance",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		//#region \0dsh-css:E:\dsh\deepseek-harness-master\deepseek-harness-master\packages\client\ui-settings-prompt-enhance\src\client\EnhanceSection.module.css.mjs
		const css = ".ytSe2G_section{max-width:720px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:12px;display:flex}.ytSe2G_title{margin:0;font-size:18px;font-weight:600}.ytSe2G_intro{color:var(--dsw-alias-label-tertiary);margin:0;font-size:13px}.ytSe2G_group{flex-direction:column;gap:10px;display:flex}.ytSe2G_group+.ytSe2G_group{margin-top:8px}.ytSe2G_groupHead{letter-spacing:.06em;text-transform:uppercase;color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;font-weight:600}.ytSe2G_rows{flex-direction:column;gap:12px;margin:0;padding:0;list-style:none;display:flex}.ytSe2G_rowCard{border:.5px solid var(--dsw-alias-settings-card-stroke);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-settings-card-fill);justify-content:space-between;align-items:flex-start;gap:24px;padding:14px 16px;transition:background .16s;display:flex}.ytSe2G_rowCard:hover{background:var(--dsw-alias-interactive-bg-hover)}.ytSe2G_rowText{flex-direction:column;gap:3px;min-width:0;display:flex}.ytSe2G_rowTitle{font-size:15px;font-weight:600;line-height:1.4}.ytSe2G_rowDesc{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:1.55}.ytSe2G_error{color:var(--dsw-alias-state-error-primary);margin:0;font-size:12px}.ytSe2G_fields{border:.5px solid var(--dsw-alias-settings-card-stroke);border-radius:var(--dsw-radius-xl);background:var(--dsw-alias-settings-card-fill);flex-direction:column;gap:14px;padding:14px 16px;display:flex}.ytSe2G_field{align-items:flex-start;gap:24px;display:flex}.ytSe2G_fieldText{flex-direction:column;flex:none;gap:3px;width:200px;display:flex}.ytSe2G_control{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-2);min-width:0;height:30px;color:var(--dsw-alias-label-primary);flex:1;padding:0 10px;font-size:13px}.ytSe2G_control:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-1px}.ytSe2G_control:disabled{opacity:.5}.ytSe2G_select{box-sizing:border-box;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-lg);color-scheme:light dark;background-color:var(--dsw-alias-bg-layer-2);min-width:0;max-width:360px;height:30px;color:var(--dsw-alias-label-primary);white-space:nowrap;cursor:pointer;appearance:none;background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\");background-position:right 8px center;background-repeat:no-repeat;background-size:12px 12px;outline:none;flex:1;padding:0 28px 0 10px;font-size:13px;line-height:20px}.ytSe2G_select option{background-color:var(--dsw-alias-bg-layer-1,#1c1c1e);color:var(--dsw-alias-label-primary)}.ytSe2G_select option:checked,.ytSe2G_select option:hover{background-color:var(--dsw-alias-interactive-bg-hover-solid,#303034)}.ytSe2G_select:hover:not(:disabled){background-color:var(--dsw-alias-interactive-bg-hover)}.ytSe2G_select:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-1px}.ytSe2G_select:disabled{opacity:.5;cursor:default}.ytSe2G_editorFooter{align-items:center;gap:10px;display:flex}.ytSe2G_status{color:var(--dsw-alias-label-tertiary);font-size:12px}.ytSe2G_editor{box-sizing:border-box;resize:vertical;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-2);width:100%;min-height:150px;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-mono,ui-monospace, SFMono-Regular, Menlo, monospace);white-space:pre;tab-size:2;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);margin:0;padding:12px;font-size:12.5px;line-height:1.6}.ytSe2G_editor:focus-visible{outline:var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary));outline-offset:-1px}.ytSe2G_templateHead{align-items:baseline;gap:8px;display:flex}.ytSe2G_templateTitle{margin:0;font-size:14px;font-weight:600}.ytSe2G_badge{color:var(--dsw-alias-label-tertiary);font-size:11px}.ytSe2G_path{font-size:11.5px;font-family:var(--dsw-font-mono,ui-monospace, SFMono-Regular, Menlo, monospace);color:var(--dsw-alias-label-tertiary);word-break:break-all;margin:4px 0 0}";
		const tagId = "@istarry/dsh-client-ui-settings-prompt-enhance/EnhanceSection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@istarry/dsh-client-ui-settings-prompt-enhance";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var EnhanceSection_module_css_default = {
			"badge": "ytSe2G_badge",
			"control": "ytSe2G_control",
			"editor": "ytSe2G_editor",
			"editorFooter": "ytSe2G_editorFooter",
			"error": "ytSe2G_error",
			"field": "ytSe2G_field",
			"fieldText": "ytSe2G_fieldText",
			"fields": "ytSe2G_fields",
			"group": "ytSe2G_group",
			"groupHead": "ytSe2G_groupHead",
			"intro": "ytSe2G_intro",
			"path": "ytSe2G_path",
			"rowCard": "ytSe2G_rowCard",
			"rowDesc": "ytSe2G_rowDesc",
			"rowText": "ytSe2G_rowText",
			"rowTitle": "ytSe2G_rowTitle",
			"rows": "ytSe2G_rows",
			"section": "ytSe2G_section",
			"select": "ytSe2G_select",
			"status": "ytSe2G_status",
			"templateHead": "ytSe2G_templateHead",
			"templateTitle": "ytSe2G_templateTitle",
			"title": "ytSe2G_title"
		};
		//#endregion
		//#region src/client/EnhanceSection.tsx
		/**
		* Prompt-enhance settings section: the enable switch, the generation
		* parameters (the model override as a dropdown over the official model
		* catalog), and the two editable prompt templates. Visual language mirrors
		* the official settings sections: one column capped at 720px, an 18px title
		* over a tertiary intro, uppercase group heads, card rows built on the
		* settings-card tokens, and mono editors styled like the composition viewer.
		*/
		/**
		* Render the prompt-enhance settings section.
		* @param props - settings actions, snapshot hook, and localized copy.
		* @returns the section page.
		*/
		function EnhanceSection({ useEnhanceSection, toggleEnabled, setParam, saveParams, loadModels, setTemplate, saveTemplates, restoreTemplates, loadTemplates, t }) {
			const state = useEnhanceSection((value) => value);
			const [switchBusy, setSwitchBusy] = (0, react.useState)(false);
			const [switchFailed, setSwitchFailed] = (0, react.useState)(false);
			const [paramsBusy, setParamsBusy] = (0, react.useState)(false);
			const [templatesBusy, setTemplatesBusy] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				loadModels();
			}, [loadModels]);
			(0, react.useEffect)(() => {
				loadTemplates();
			}, [loadTemplates]);
			const disabled = state.status !== "ready";
			const templates = state.templates;
			const useSelect = state.modelsStatus === "ready" && state.models.length > 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: EnhanceSection_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
						className: EnhanceSection_module_css_default.title,
						children: t("nav")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: EnhanceSection_module_css_default.intro,
						children: t("intro")
					}),
					state.status === "unavailable" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: EnhanceSection_module_css_default.error,
						role: "alert",
						children: t("unavailable")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: EnhanceSection_module_css_default.group,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							className: EnhanceSection_module_css_default.groupHead,
							children: t("switchesGroup")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
							className: EnhanceSection_module_css_default.rows,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
								className: EnhanceSection_module_css_default.rowCard,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: EnhanceSection_module_css_default.rowText,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.rowTitle,
											children: t("enabled.title")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.rowDesc,
											children: t("enabled.description")
										}),
										switchFailed && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.error,
											role: "alert",
											children: t("writeFailed")
										})
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
									checked: state.params.enabled,
									disabled: disabled || switchBusy,
									label: t("enabled.title"),
									onChange: (next) => {
										setSwitchFailed(false);
										setSwitchBusy(true);
										toggleEnabled(next).catch(() => {
											setSwitchFailed(true);
										}).finally(() => {
											setSwitchBusy(false);
										});
									}
								})]
							})
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: EnhanceSection_module_css_default.group,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
							className: EnhanceSection_module_css_default.groupHead,
							children: t("paramsGroup")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: EnhanceSection_module_css_default.fields,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: EnhanceSection_module_css_default.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: EnhanceSection_module_css_default.fieldText,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.rowTitle,
											children: t("overrideModel.title")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.rowDesc,
											children: t("overrideModel.description")
										})]
									}), useSelect ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
										className: EnhanceSection_module_css_default.select,
										value: state.paramsDraft.overrideModel,
										disabled,
										onChange: (event) => {
											setParam("overrideModel", event.target.value);
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "",
											children: t("overrideModel.follow")
										}), state.models.map((choice) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: choice.value,
											children: choice.label
										}, choice.value))]
									}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: EnhanceSection_module_css_default.field,
										style: {
											flex: 1,
											minWidth: 0
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											className: EnhanceSection_module_css_default.control,
											type: "text",
											value: state.paramsDraft.overrideModel,
											placeholder: state.modelsStatus === "loading" ? t("overrideModel.loading") : state.modelsStatus === "failed" ? t("overrideModel.loadFailed") : "provider/model",
											spellCheck: false,
											disabled,
											onChange: (event) => {
												setParam("overrideModel", event.target.value);
											}
										})
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: EnhanceSection_module_css_default.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: EnhanceSection_module_css_default.fieldText,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.rowTitle,
											children: t("temperature.title")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.rowDesc,
											children: t("temperature.description")
										})]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										className: EnhanceSection_module_css_default.control,
										type: "number",
										min: 0,
										max: 2,
										step: .1,
										value: state.paramsDraft.temperature,
										disabled,
										onChange: (event) => {
											const next = Number(event.target.value);
											if (Number.isFinite(next)) setParam("temperature", next);
										}
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: EnhanceSection_module_css_default.field,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: EnhanceSection_module_css_default.fieldText,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.rowTitle,
											children: t("maxTokens.title")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.rowDesc,
											children: t("maxTokens.description")
										})]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										className: EnhanceSection_module_css_default.control,
										type: "number",
										min: 64,
										max: 65536,
										step: 1,
										value: state.paramsDraft.maxTokens,
										disabled,
										onChange: (event) => {
											const next = Number(event.target.value);
											if (Number.isFinite(next)) setParam("maxTokens", next);
										}
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: EnhanceSection_module_css_default.editorFooter,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "primary",
											disabled: disabled || paramsBusy || !state.paramsDirty,
											onClick: () => {
												setParamsBusy(true);
												saveParams().finally(() => {
													setParamsBusy(false);
												});
											},
											children: state.paramsSaveState === "saving" ? t("params.saving") : t("params.save")
										}),
										state.paramsSaveState === "saved" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.status,
											role: "status",
											children: t("params.saved")
										}),
										state.paramsSaveState === "failed" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: EnhanceSection_module_css_default.error,
											role: "alert",
											children: state.paramsError ?? t("params.saveFailed")
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
						className: EnhanceSection_module_css_default.group,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
								className: EnhanceSection_module_css_default.groupHead,
								children: t("templatesGroup")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: EnhanceSection_module_css_default.rowDesc,
								children: t("templates.hint")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: EnhanceSection_module_css_default.fields,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: EnhanceSection_module_css_default.templateHead,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
												className: EnhanceSection_module_css_default.templateTitle,
												children: t("templates.system")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: EnhanceSection_module_css_default.badge,
												children: templates.system.fromFile ? t("templates.fromFile") : t("templates.builtin")
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: EnhanceSection_module_css_default.path,
											children: templates.system.path
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
											className: EnhanceSection_module_css_default.editor,
											value: templates.system.text,
											spellCheck: false,
											disabled: disabled || templates.status === "saving" || templates.status === "loading",
											onChange: (event) => {
												setTemplate("system", event.target.value);
											}
										})
									] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: EnhanceSection_module_css_default.templateHead,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
												className: EnhanceSection_module_css_default.templateTitle,
												children: t("templates.user")
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: EnhanceSection_module_css_default.badge,
												children: templates.user.fromFile ? t("templates.fromFile") : t("templates.builtin")
											})]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: EnhanceSection_module_css_default.rowDesc,
											children: t("templates.userHint")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
											className: EnhanceSection_module_css_default.path,
											children: templates.user.path
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
											className: EnhanceSection_module_css_default.editor,
											value: templates.user.text,
											spellCheck: false,
											disabled: disabled || templates.status === "saving" || templates.status === "loading",
											onChange: (event) => {
												setTemplate("user", event.target.value);
											}
										})
									] }),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: EnhanceSection_module_css_default.editorFooter,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "primary",
												disabled: disabled || templatesBusy || templates.status === "loading",
												onClick: () => {
													setTemplatesBusy(true);
													saveTemplates().finally(() => {
														setTemplatesBusy(false);
													});
												},
												children: templates.status === "saving" ? t("templates.saving") : t("templates.save")
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												variant: "outline",
												disabled: disabled || templatesBusy || templates.status === "loading",
												onClick: () => {
													setTemplatesBusy(true);
													restoreTemplates().finally(() => {
														setTemplatesBusy(false);
													});
												},
												children: t("templates.restore")
											}),
											templates.status === "saved" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: EnhanceSection_module_css_default.status,
												role: "status",
												children: t("templates.saved")
											}),
											templates.status === "failed" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: EnhanceSection_module_css_default.error,
												role: "alert",
												children: templates.error ?? t("templates.saveFailed")
											})
										]
									})
								]
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region src/client/enhance-store.ts
		/** One accepted section; malformed durable values read as the defaults. */
		function decodeEnhanceParams(section) {
			const source = typeof section === "object" && section !== null && !Array.isArray(section) ? section : {};
			return {
				enabled: source.enabled !== false,
				overrideModel: typeof source.overrideModel === "string" ? source.overrideModel : "",
				temperature: typeof source.temperature === "number" && Number.isFinite(source.temperature) ? source.temperature : .7,
				maxTokens: typeof source.maxTokens === "number" && Number.isFinite(source.maxTokens) ? source.maxTokens : 2048
			};
		}
		/** One settings-page controller (one per browser page). */
		var EnhanceSettingsController = class {
			form;
			resolveRemote;
			loadCatalog;
			/** Snapshot the section renderer subscribes to. */
			store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
				status: "loading",
				params: decodeEnhanceParams(void 0),
				paramsDraft: decodeEnhanceParams(void 0),
				paramsDirty: false,
				paramsSaveState: "idle",
				paramsError: null,
				models: [],
				modelsStatus: "idle",
				templates: {
					system: {
						path: "",
						text: "",
						fromFile: false
					},
					user: {
						path: "",
						text: "",
						fromFile: false
					},
					promptsDir: "",
					status: "idle",
					error: null
				}
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
				this.unsubscribe = form.subscribe(() => {
					this.deriveParams();
				});
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
					modelsStatus: "loading"
				});
				try {
					const models = (await this.loadCatalog()).groups.flatMap((group) => group.models.map((model) => ({
						value: `${group.id}/${model.id}`,
						label: `${group.name} · ${model.name}`
					})));
					this.store.set({
						...this.store.getSnapshot(),
						models,
						modelsStatus: "ready"
					});
				} catch {
					this.store.set({
						...this.store.getSnapshot(),
						models: [],
						modelsStatus: "failed"
					});
				}
			}
			/** Toggle the enable switch through the shared configuration form. */
			async toggleEnabled(next) {
				await this.form.set("enabled", next);
			}
			/** Update one parameter draft field (client-side until saved). */
			setParam(field, value) {
				const snapshot = this.store.getSnapshot();
				this.store.set({
					...snapshot,
					paramsDraft: {
						...snapshot.paramsDraft,
						[field]: value
					},
					paramsDirty: true,
					paramsSaveState: "idle"
				});
			}
			/** Save the parameter draft through the configuration form. */
			async saveParams() {
				const { paramsDraft } = this.store.getSnapshot();
				this.store.set({
					...this.store.getSnapshot(),
					paramsSaveState: "saving",
					paramsError: null
				});
				try {
					await this.form.set("overrideModel", paramsDraft.overrideModel);
					await this.form.set("temperature", paramsDraft.temperature);
					await this.form.set("maxTokens", paramsDraft.maxTokens);
					this.store.set({
						...this.store.getSnapshot(),
						paramsDirty: false,
						paramsSaveState: "saved",
						paramsError: null
					});
					this.deriveParams();
				} catch (error) {
					this.store.set({
						...this.store.getSnapshot(),
						paramsSaveState: "failed",
						paramsError: error instanceof Error ? error.message : String(error)
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
						[kind]: {
							...snapshot.templates[kind],
							text
						},
						status: "idle"
					}
				});
			}
			/** Load both templates from the Remote namespace into the editor. */
			async loadTemplates() {
				const remote = this.resolveRemote();
				if (remote === void 0) {
					this.failTemplates("promptEnhance namespace is not mounted");
					return;
				}
				this.store.set({
					...this.store.getSnapshot(),
					templates: {
						...this.store.getSnapshot().templates,
						status: "loading",
						error: null
					}
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
							status: "idle",
							error: null
						}
					});
				} catch (error) {
					this.failTemplates(error instanceof Error ? error.message : String(error));
				}
			}
			/** Save both template files through the Remote namespace. */
			async saveTemplates() {
				const remote = this.resolveRemote();
				if (remote === void 0) {
					this.failTemplates("promptEnhance namespace is not mounted");
					return;
				}
				const { system, user } = this.store.getSnapshot().templates;
				this.store.set({
					...this.store.getSnapshot(),
					templates: {
						...this.store.getSnapshot().templates,
						status: "saving",
						error: null
					}
				});
				try {
					const written = await remote.writeTemplates({
						system: system.text,
						user: user.text
					});
					this.store.set({
						...this.store.getSnapshot(),
						templates: {
							...this.store.getSnapshot().templates,
							system: written.system,
							user: written.user,
							promptsDir: written.promptsDir,
							status: "saved",
							error: null
						}
					});
				} catch (error) {
					this.failTemplates(error instanceof Error ? error.message : String(error));
				}
			}
			/** Restore both templates to the built-in defaults (writes the files). */
			async restoreTemplates() {
				const remote = this.resolveRemote();
				if (remote === void 0) {
					this.failTemplates("promptEnhance namespace is not mounted");
					return;
				}
				this.store.set({
					...this.store.getSnapshot(),
					templates: {
						...this.store.getSnapshot().templates,
						status: "saving",
						error: null
					}
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
							status: "saved",
							error: null
						}
					});
				} catch (error) {
					this.failTemplates(error instanceof Error ? error.message : String(error));
				}
			}
			failTemplates(message) {
				this.store.set({
					...this.store.getSnapshot(),
					templates: {
						...this.store.getSnapshot().templates,
						status: "failed",
						error: message
					}
				});
			}
			deriveParams() {
				const snapshot = this.form.getSnapshot();
				const live = snapshot.value === void 0 ? decodeEnhanceParams(void 0) : decodeEnhanceParams(snapshot.value);
				const current = this.store.getSnapshot();
				this.store.set({
					...current,
					status: snapshot.status === "ready" ? "ready" : snapshot.status === "loading" ? "loading" : "unavailable",
					params: live,
					paramsDraft: current.paramsDirty ? current.paramsDraft : live
				});
			}
		};
		//#endregion
		//#region src/client/locales.ts
		/**
		* Copy for the prompt-enhance settings page, keyed per locale.
		*/
		/** Dictionary of the prompt-enhance settings page. */
		const zh = {
			"nav": "增强提示词",
			"intro": "发送框旁的星形按钮把草稿重写为更清晰的提示词：单轮调用、不读取会话历史，附件不参与也不受影响。",
			"unavailable": "增强服务未挂载，请确认插件已启用。",
			"writeFailed": "写入失败，请重试。",
			"switchesGroup": "开关",
			"enabled.title": "显示增强按钮",
			"enabled.description": "在输入框发送按钮左侧显示星形增强按钮。",
			"paramsGroup": "生成参数",
			"overrideModel.title": "覆盖模型",
			"overrideModel.description": "选择增强时使用的模型；默认跟随会话当前选中的模型。",
			"overrideModel.follow": "跟随会话（使用当前选中的模型）",
			"overrideModel.loading": "正在加载模型列表…",
			"overrideModel.loadFailed": "模型列表加载失败，可直接输入 provider/model",
			"temperature.title": "温度",
			"temperature.description": "重写的采样温度，0–2，越高越发散。",
			"maxTokens.title": "输出上限",
			"maxTokens.description": "单次重写的最大输出 token 数。",
			"params.save": "保存参数",
			"params.saving": "保存中…",
			"params.saved": "已保存",
			"params.saveFailed": "参数保存失败",
			"templatesGroup": "提示词模板",
			"templates.hint": "模板保存在 Harness 主目录的 prompt-enhance\\prompts 文件夹中（首次使用时从插件内置默认自动生成），改动文件后下一次增强立即生效，无需重启；在此编辑与直接改文件等效。",
			"templates.system": "系统模板（重写规则，随请求固定下发）",
			"templates.user": "用户模板（随每次请求携带草稿）",
			"templates.userHint": "内容可自由编写：若包含 {input}，草稿会插入该位置；不包含时草稿自动附在模板末尾，无需占位符。",
			"templates.save": "保存模板",
			"templates.saving": "保存中…",
			"templates.saved": "已保存",
			"templates.saveFailed": "模板保存失败",
			"templates.restore": "恢复默认模板",
			"templates.fromFile": "来自文件",
			"templates.builtin": "内置默认（尚无文件）"
		};
		/** English dictionary of the prompt-enhance settings page. */
		const en = {
			"nav": "Prompt Enhancement",
			"intro": "The star button beside the send action rewrites your draft into a clearer prompt: one stateless LLM call, no session history, attachments untouched.",
			"unavailable": "The enhance service is not mounted; make sure the plugin is enabled.",
			"writeFailed": "The write failed; try again.",
			"switchesGroup": "Switches",
			"enabled.title": "Show the enhance button",
			"enabled.description": "Show the star enhance button left of the composer send action.",
			"paramsGroup": "Generation parameters",
			"overrideModel.title": "Model override",
			"overrideModel.description": "Pick the model enhancements run on; by default the session's current model is used.",
			"overrideModel.follow": "Follow the session (use the currently selected model)",
			"overrideModel.loading": "Loading the model list…",
			"overrideModel.loadFailed": "The model list failed to load; type provider/model directly",
			"temperature.title": "Temperature",
			"temperature.description": "Sampling temperature of the rewrite, 0–2.",
			"maxTokens.title": "Output cap",
			"maxTokens.description": "Maximum output tokens of one rewrite.",
			"params.save": "Save parameters",
			"params.saving": "Saving…",
			"params.saved": "Saved",
			"params.saveFailed": "Saving the parameters failed",
			"templatesGroup": "Prompt templates",
			"templates.hint": "The templates live in the harness home under prompt-enhance\\prompts (seeded from the plugin's bundled defaults on first use); on-disk edits apply from the next enhancement without a restart, and editing here is equivalent.",
			"templates.system": "System template (the standing rewrite policy, sent with every call)",
			"templates.user": "User template (carries the draft on every call)",
			"templates.userHint": "Write it freely: with {input} the draft is inserted at that spot; without it the draft is appended after the template — no placeholder required.",
			"templates.save": "Save templates",
			"templates.saving": "Saving…",
			"templates.saved": "Saved",
			"templates.saveFailed": "Saving the templates failed",
			"templates.restore": "Restore default templates",
			"templates.fromFile": "from file",
			"templates.builtin": "built-in default (no file yet)"
		};
		//#endregion
		//#region src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "settings.promptEnhance";
		/** The host plugin entry whose configuration section holds the parameters. */
		const HOST_ENTRY = "prompt-enhance";
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"locale",
			"configForms"
		];
		/**
		* Register the prompt-enhance section and its dictionaries.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-settings-prompt-enhance: dictionaries");
			const form = ctx.configForms.get(HOST_ENTRY);
			const unwrap = (envelope) => {
				const failure = envelope;
				if (typeof envelope !== "object" || envelope === null || failure.ok !== true) throw new Error(failure.error?.message ?? "promptEnhance call failed");
				return envelope.value;
			};
			const namespace = () => {
				try {
					return ctx.get("remote.promptEnhance");
				} catch {
					return;
				}
			};
			const loadCatalog = async () => {
				let session;
				try {
					session = ctx.get("remote.session");
				} catch {
					session = void 0;
				}
				if (session === void 0 || typeof session.modelCatalog !== "function") throw new Error("the session Remote namespace is not mounted");
				return unwrap(await session.modelCatalog());
			};
			const controller = new EnhanceSettingsController(form, () => {
				const remote = namespace();
				if (remote === void 0) return void 0;
				return {
					readTemplates: async () => unwrap(await remote.readTemplates()),
					writeTemplates: async (request) => unwrap(await remote.writeTemplates(request)),
					restoreTemplates: async () => unwrap(await remote.restoreTemplates())
				};
			}, loadCatalog);
			ctx.effect(() => () => {
				controller.dispose();
			}, "ui-settings-prompt-enhance: form subscription");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "prompt-enhance",
				order: 26,
				label: () => t("nav"),
				locale: NS,
				inject: () => ({
					hooks: { enhanceSection: controller.store },
					toggleEnabled: (next) => controller.toggleEnabled(next),
					setParam: (field, value) => {
						controller.setParam(field, value);
					},
					saveParams: () => controller.saveParams(),
					loadModels: () => controller.loadModels(),
					setTemplate: (kind, text) => {
						controller.setTemplate(kind, text);
					},
					saveTemplates: () => controller.saveTemplates(),
					restoreTemplates: () => controller.restoreTemplates(),
					loadTemplates: () => controller.loadTemplates()
				})
			}, EnhanceSection));
		}
		//#endregion
		exports.EnhanceSection = EnhanceSection;
		exports.EnhanceSettingsController = EnhanceSettingsController;
		exports.apply = apply;
		exports.decodeEnhanceParams = decodeEnhanceParams;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map