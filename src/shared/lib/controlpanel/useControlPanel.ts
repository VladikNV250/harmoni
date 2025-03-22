import { useState } from "react";

export const useControlPanel = <T extends Record<string, boolean>>(initialState: T) => {
    const [controlPanel, setControlPanel] = useState<T>(initialState);

    const updateControlPanel = <K extends keyof T>(key: K, state: T[K]) => {
        setControlPanel(prevState => ({
            ...prevState,
            [key]: state
        }));
    };

    return {
        controlPanel,
        updateControlPanel
    };
};