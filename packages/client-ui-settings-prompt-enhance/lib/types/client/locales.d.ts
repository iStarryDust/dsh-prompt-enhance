/**
 * Copy for the prompt-enhance settings page, keyed per locale.
 */
/** Dictionary of the prompt-enhance settings page. */
export declare const zh: {
    readonly nav: "增强提示词";
    readonly intro: "发送框旁的星形按钮把草稿重写为更清晰的提示词：单轮调用、不读取会话历史，附件不参与也不受影响。";
    readonly unavailable: "增强服务未挂载，请确认插件已启用。";
    readonly writeFailed: "写入失败，请重试。";
    readonly switchesGroup: "开关";
    readonly 'enabled.title': "显示增强按钮";
    readonly 'enabled.description': "在输入框发送按钮左侧显示星形增强按钮。";
    readonly paramsGroup: "生成参数";
    readonly 'overrideModel.title': "覆盖模型";
    readonly 'overrideModel.description': "选择增强时使用的模型；默认跟随会话当前选中的模型。";
    readonly 'overrideModel.follow': "跟随会话（使用当前选中的模型）";
    readonly 'overrideModel.loading': "正在加载模型列表…";
    readonly 'overrideModel.loadFailed': "模型列表加载失败，可直接输入 provider/model";
    readonly 'temperature.title': "温度";
    readonly 'temperature.description': "重写的采样温度，0–2，越高越发散。";
    readonly 'maxTokens.title': "输出上限";
    readonly 'maxTokens.description': "单次重写的最大输出 token 数。";
    readonly 'params.save': "保存参数";
    readonly 'params.saving': "保存中…";
    readonly 'params.saved': "已保存";
    readonly 'params.saveFailed': "参数保存失败";
    readonly templatesGroup: "提示词模板";
    readonly 'templates.hint': "模板保存在 Harness 主目录的 prompt-enhance\\prompts 文件夹中（首次使用时从插件内置默认自动生成），改动文件后下一次增强立即生效，无需重启；在此编辑与直接改文件等效。";
    readonly 'templates.system': "系统模板（重写规则，随请求固定下发）";
    readonly 'templates.user': "用户模板（随每次请求携带草稿）";
    readonly 'templates.userHint': "内容可自由编写：若包含 {input}，草稿会插入该位置；不包含时草稿自动附在模板末尾，无需占位符。";
    readonly 'templates.save': "保存模板";
    readonly 'templates.saving': "保存中…";
    readonly 'templates.saved': "已保存";
    readonly 'templates.saveFailed': "模板保存失败";
    readonly 'templates.restore': "恢复默认模板";
    readonly 'templates.fromFile': "来自文件";
    readonly 'templates.builtin': "内置默认（尚无文件）";
};
/** English dictionary of the prompt-enhance settings page. */
export declare const en: Record<keyof typeof zh, string>;
/** Every locale key the prompt-enhance settings page owns. */
export type PromptEnhanceSettingsKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map