/**
 * Copy for the composer enhance button, keyed per locale.
 */
/** Dictionary of the enhance button surface. */
export declare const zh: {
    readonly 'button.enhance': "增强提示词";
    readonly 'button.cancel': "取消增强";
    readonly 'button.restore': "恢复原文";
    readonly 'error.noModel': "无法获取当前模型，请先在会话中选择模型";
    readonly 'error.unavailable': "增强服务未就绪，请稍后重试";
    readonly 'error.references': "输入包含引用块，暂不支持增强";
    readonly 'notice.enhancing': "正在增强提示词…";
    readonly 'notice.done': "提示词已增强，可点击星形按钮恢复原文";
    readonly 'notice.cancelled': "已取消增强，原文未改动";
};
/** English dictionary of the enhance button surface. */
export declare const en: Record<keyof typeof zh, string>;
/** Every locale key the enhance button surface owns. */
export type PromptEnhanceKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map