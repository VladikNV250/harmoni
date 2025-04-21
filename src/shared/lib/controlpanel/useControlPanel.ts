import { useCallback, useState } from "react";

/**
 * @hook useControlPanel
 * @description Custom hook to manage a set of boolean flags (like visibility toggles or control states) in a unified state object.
 * Useful for building UI menus, toggles, filters, etc., where each key represents a separate boolean state.
 *
 * @template T A record type where all values are booleans (e.g., {moreMenu: false, shuffle: true, playlistMenu: false}).
 *
 * @param {T} initialState Initial object state with keys representing control flags and boolean values.
 * @returns {{
 *   controlPanel: T,
 *   updateControlPanel: <K extends keyof T>(key: K, state: T[K]) => void
 * }}
 * An object containing:
 *  `controlPanel`: the current control state.
 *  `updateControlPanel`: A callback to update the state of a specific control by key.
 *
 * @example
 * const { controlPanel, updateControlPanel } = useControlPanel({
 *   moreMenu: false,
 *   shuffle: false,
 *   playlistMenu: false,
 * } as Record<boolean>)
 *
 * updateControlPanel("moreMenu", true); // opens the more menu.
 */
export const useControlPanel = <T extends Record<string, boolean>>(
    initialState: T
) => {
    const [controlPanel, setControlPanel] = useState<T>(initialState);

    const updateControlPanel = useCallback(
        <K extends keyof T>(key: K, state: T[K]) => {
            setControlPanel((prevState) => ({
                ...prevState,
                [key]: state,
            }));
        },
        []
    );

    return {
        controlPanel,
        updateControlPanel,
    };
};
