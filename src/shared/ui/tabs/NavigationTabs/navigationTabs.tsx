import { Description } from "shared/ui/typography/description";
import clsx from "clsx";
import styles from "./style.module.scss";


interface INavigationTabs<T = string> {
    /** All tabs */
    readonly tabs: T[];
    /** Current active tab */
    readonly activeTab: T;
    /** Function to switch tab */
    readonly chooseTab: (tab: T) => void;
    /** Additional styles */
    readonly className?: string;
}

/**
 * @component NavigationTabs
 * 
 * Component has custom type of tabs.
 * @example
 * // NavigationTabs with custom type of tabs
 * type TArtistTabs = "Albums" | "Top Tracks" | "Compilations"
 * <NavigationTabs<TArtistTabs>
 *   tabs={["Albums", "Top Tracks", "Compilations"]}
 *   activeTab={activeTab}
 *   chooseTab={chooseTab}
 *   className={theme}
 * />
 */
export const NavigationTabs = <T,>({ tabs, activeTab, chooseTab, className }: INavigationTabs<T>) => {    
    
    const renderTabs = (items: typeof tabs) => {
        return items.map((tab, index) => 
            <div 
                key={index}
                onClick={() => chooseTab(tab)}
                className={clsx(
                    styles["tab"], 
                    tab === activeTab && styles["active"]
                )}
            > 
                <Description className={styles["tab-name"]}>
                    {tab as string ?? ""}
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
