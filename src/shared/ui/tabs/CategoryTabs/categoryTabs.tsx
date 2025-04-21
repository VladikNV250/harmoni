import { Text } from "shared/ui/typography/text";
import styles from "./style.module.scss";
import clsx from "clsx";

interface ICategoryTabs<T = string> {
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
 * @component CategoryTabs
 * 
 * Component has custom type of tabs.
 * @example
 * // CategoryTabs with custom type of tabs
 * type TFeedFilter = "All" | "Music" | "Podcasts"
 * <CategoryTabs<TFeedFilter>
 *   tabs={["All", "Music", "Podcasts"]}
 *   activeTab={activeTab}
 *   chooseTab={chooseTab}
 *   className={theme}
 * />
 */
export const CategoryTabs = <T,>({ tabs, activeTab, chooseTab, className }: ICategoryTabs<T>) => {

    const renderTabs = (items: typeof tabs) => {
        return items.map((tab, index) =>
            <div
                key={index}
                onClick={() => chooseTab(tab)}
                className={clsx(
                    styles["tab"],
                    activeTab === tab && styles["active"]
                )}
            >
                <Text>
                    {tab as string ?? ""}
                </Text>
            </div>
        )
    }

    return (
        <div
            className={clsx(
                styles["tabs-container"],
                className && styles[className]
            )}
        >
            <div className={styles["tabs-slider"]}>
                {renderTabs(tabs)}
            </div>
        </div>
    )
}
