import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** The controller snapshot the button renders from. */
export interface EnhanceConfigState {
    /** Whether the host plugin is mounted and the settings switch is on. */
    available: boolean;
    /** Whether the generated Remote namespace has mounted. */
    remoteReady: boolean;
    /** The Remote mount failure, when the contribution could not mount. */
    mountError: string | null;
}
/** Injected face of the `conversation.input.right` entry. */
export interface EnhanceInjected {
    /** Page-level controller state (the settings switch). */
    hooks: {
        /** Snapshot hook bound by the renderer as useEnhanceConfig. */
        enhanceConfig: SnapshotStore<EnhanceConfigState>;
    };
    /**
     * Run the enhancement for one draft: resolves the session's current model
     * and the Remote namespace, and returns the rewritten text.
     * @param text - the draft text to enhance.
     * @returns the enhanced prompt text.
     */
    enhance: (text: string) => Promise<string>;
    /** Surface a composer-routed notice (errors, cancellation). */
    notify: (level: 'info' | 'error', text: string) => void;
}
/** Props assembled by the slot renderer. */
export type EnhanceButtonProps = PropsRuntime<'conversation.input.right'> & PropsLocale<'promptEnhance'> & InjectFace<EnhanceInjected>;
/**
 * Render the enhance button for one session's composer.
 * @param props - input state, actions, controller, and localized copy.
 * @returns the button, or nothing while unavailable.
 */
export declare function EnhanceButton({ useInput, useEnhanceConfig, inputActions, enhance, notify, t, }: EnhanceButtonProps): import("react").JSX.Element | null;
//# sourceMappingURL=enhance-button.d.ts.map