import { useState } from "react"

/**
 * @hook useTabs
 * @description Custom hook to manage tab state. Clicking the active tab resets it.
 * 
 * @param defaultActiveTab - The default tab to use initially or when deselecting.
 * @returns Current active tab and a function to change it.
 */
export const useTabs = <T, D>(defaultActiveTab: D) => {
    const [activeTab, setActiveTab] = useState<T | D>(defaultActiveTab);

    const chooseTab = (tab: T | D) => {
        if (activeTab === tab) setActiveTab(defaultActiveTab);
        else setActiveTab(tab);
    }

    return { activeTab, chooseTab }
}