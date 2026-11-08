import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The composer enhance button: a compact control in the
 * `conversation.input.right` strip, immediately left of the submit action.
 * Three gestures share one control — enhance (idle), cancel (while the
 * rewrite runs), and restore-original (after a rewrite replaced the draft).
 * Failure never touches the draft: the error surfaces as a composer notice
 * and stays in the button's tooltip until the next action.
 */
import { useRef, useState } from 'react';
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './enhance-button.module.css';
/** The four-point star glyph. */
function SparkIcon() {
    return (_jsxs("svg", { viewBox: "0 0 16 16", width: "16", height: "16", "aria-hidden": true, children: [_jsx("path", { d: "M8 1.2c.14 0 .27.09.31.22l1.3 4.06a.33.33 0 0 0 .21.21l4.06 1.3a.33.33 0 0 1 0 .62l-4.06 1.3a.33.33 0 0 0-.21.21l-1.3 4.06a.33.33 0 0 1-.62 0l-1.3-4.06a.33.33 0 0 0-.21-.21l-4.06-1.3a.33.33 0 0 1 0-.62l4.06-1.3a.33.33 0 0 0 .21-.21l1.3-4.06A.33.33 0 0 1 8 1.2Z", fill: "currentColor" }), _jsx("path", { d: "M13.2 10.6c.05 0 .1.03.11.08l.42 1.31c.01.05.05.09.1.1l1.31.42a.11.11 0 0 1 0 .21l-1.31.42a.16.16 0 0 0-.1.1l-.42 1.31a.11.11 0 0 1-.21 0l-.42-1.31a.16.16 0 0 0-.1-.1l-1.31-.42a.11.11 0 0 1 0-.21l1.31-.42c.05-.01.09-.05.1-.1l.42-1.31c.01-.05.06-.08.11-.08Z", fill: "currentColor" })] }));
}
/** The undo glyph (restore the pre-enhancement draft). */
function RestoreIcon() {
    return (_jsx("svg", { viewBox: "0 0 16 16", width: "16", height: "16", "aria-hidden": true, children: _jsx("path", { d: "M6.5 2.1a.5.5 0 0 1 .4.8L5.6 4.6h3.9a4.5 4.5 0 1 1-4.42 5.36.6.6 0 0 1 1.18-.22A3.3 3.3 0 1 0 9.5 5.8H5.6l1.3 1.7a.5.5 0 0 1-.8.6L3.9 5.2a.5.5 0 0 1 0-.6L6.1 2.3a.5.5 0 0 1 .4-.2Z", fill: "currentColor" }) }));
}
/**
 * Render the enhance button for one session's composer.
 * @param props - input state, actions, controller, and localized copy.
 * @returns the button, or nothing while unavailable.
 */
export function EnhanceButton({ useInput, useEnhanceConfig, inputActions, enhance, notify, t, }) {
    const input = useInput(value => value);
    const config = useEnhanceConfig(value => value);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const backupRef = useRef(null);
    const abortRef = useRef(null);
    const draft = input.draft;
    const empty = draft.trim() === '';
    const hasReferences = input.occurrences.length > 0;
    const restorable = backupRef.current !== null;
    const tooltip = busy
        ? t('button.cancel')
        : restorable
            ? t('button.restore')
            : error ?? (hasReferences ? t('error.references') : t('button.enhance'));
    const inert = !busy && !restorable && (empty || hasReferences);
    const onClick = () => {
        if (busy) {
            abortRef.current?.abort();
            return;
        }
        if (restorable) {
            const backup = backupRef.current;
            backupRef.current = null;
            setError(null);
            if (backup !== null)
                inputActions.setDraft(backup);
            return;
        }
        if (empty || hasReferences)
            return;
        const captured = draft;
        const controller = new AbortController();
        abortRef.current = controller;
        setBusy(true);
        setError(null);
        notify('info', t('notice.enhancing'));
        enhance(captured)
            .then((enhanced) => {
            if (controller.signal.aborted)
                return;
            backupRef.current = captured;
            inputActions.setDraft(enhanced);
            notify('info', t('notice.done'));
        })
            .catch((reason) => {
            if (controller.signal.aborted) {
                notify('info', t('notice.cancelled'));
                return;
            }
            const message = reason instanceof Error ? reason.message : String(reason);
            setError(message);
            notify('error', message);
        })
            .finally(() => {
            if (abortRef.current === controller)
                abortRef.current = null;
            setBusy(false);
        });
    };
    if (!config.available)
        return null;
    const className = busy
        ? `${css.button} ${css.busy}`
        : restorable
            ? `${css.button} ${css.restore}`
            : css.button;
    return (_jsx(Tooltip, { label: tooltip, side: "top", delayMs: 500, children: _jsx("button", { type: "button", className: className, "aria-label": tooltip, "aria-busy": busy, disabled: inert, onMouseDown: (event) => { event.preventDefault(); }, onClick: onClick, children: restorable && !busy ? _jsx(RestoreIcon, {}) : _jsx(SparkIcon, {}) }) }));
}
//# sourceMappingURL=enhance-button.js.map