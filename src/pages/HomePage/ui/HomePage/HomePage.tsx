import { FC, useState } from "react";
import { useTheme } from "entities/theme";
import { AdjustContextMenu } from "../AdjustContextMenu/AdjustContextMenu";
import { Adjust } from "shared/assets";
import { useAppSelector, useTabs } from "shared/lib";
import { selectFeedLoading, TFeedFilter } from "entities/feed";
import { Catalogue } from "../Catalogue/Catalogue";
import { UserTrackList } from "../UserTrackList/UserTrackList";
import { CategoryTabs, Loader } from "shared/ui";
import styles from "./style.module.scss";

const HomePage: FC = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const { activeTab, chooseTab } = useTabs<TFeedFilter, "All">("All");
    const loading = useAppSelector(selectFeedLoading);
    
    return (
        <div className={styles["home"]}>
            <Loader loading={loading} />
            <AdjustContextMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={styles["filter-bar"]}>
                <CategoryTabs<TFeedFilter> 
                    tabs={["All", "Music", "Podcasts"]}
                    activeTab={activeTab}
                    chooseTab={chooseTab}
                    className={theme}
                />
                <button 
                    className={styles["button-adjust"]} 
                    onClick={() => setIsOpen(true)}
                >
                    <Adjust width={40} height={40} className={styles["icon"]} />
                </button>                
            </div>
            <UserTrackList />
            <Catalogue type={activeTab} />
        </div>
    )
}

export default HomePage;