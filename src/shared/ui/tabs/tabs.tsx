import { FC } from "react"
import { Description } from "../typography/description";
import clsx from "clsx";
import "./tabs.scss"

interface ITabs {
    /** All tabs */
    readonly tabs: string[];
    /** Current active tab */
    readonly currTab: string;
    /** Function to set current tab */
    readonly setTab?: (tab: string) => void;
    /** Additional classes */
    readonly className?: string;
}

export const Tabs: FC<ITabs> = ({ tabs, currTab, setTab, className }) => {    
    
    const renderTabs = (tabs: string[]) => {
        return tabs.map((tab, index) => 
            <div 
                key={index}
                className={clsx("tab", tab === currTab && "active")}
                onClick={() => setTab?.(tab)}
            > 
                <Description className="tab-name">
                    {tab}
                </Description>
            </div>
        )
    }
    
    return (
        <div className={clsx("tab-list", className)}>
            {renderTabs(tabs)}
        </div>
        
    )
}