import { FC } from "react"
import { Description } from "../typography/description";
import clsx from "clsx";
import styles from "./style.module.scss";


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
                onClick={() => setTab?.(tab)}
                className={clsx(
                    styles["tab"], 
                    tab === currTab && styles["active"]
                )}
            > 
                <Description className={styles["tab-name"]}>
                    {tab}
                </Description>
            </div>
        )
    }
    
    return (
        <div className={clsx(styles["tab-list"], className)}>
            {renderTabs(tabs)}
        </div>
        
    )
}