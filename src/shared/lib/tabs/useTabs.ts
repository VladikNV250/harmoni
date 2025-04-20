import { useState } from "react"

export const useTabs = <T, D>(defaultActiveTab: D) => {
    const [activeTab, setActiveTab] = useState<T | D>(defaultActiveTab);

    const chooseTab = (tab: T | D) => {
        if (activeTab === tab) setActiveTab(defaultActiveTab);
        else setActiveTab(tab);
    }

    return { activeTab, chooseTab }
}