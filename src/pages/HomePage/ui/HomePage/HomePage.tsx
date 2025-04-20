import { FC, useEffect, useState } from "react";
import { useTheme } from "entities/theme";
import { AdjustContextMenu } from "../AdjustContextMenu/AdjustContextMenu";
import { Adjust } from "shared/assets";
import { useAppDispatch, useAppSelector, useTabs } from "shared/lib";
import { selectFeedLoading, TFeedFilter } from "entities/feed";
import { UserTrackList } from "../UserTrackList/UserTrackList";
import { CategoryTabs, Loader } from "shared/ui";
import { fetchPlaybackState, usePlaybackAdapter } from "entities/playback";
import { getUserInfo, selectUser, selectUserLoading } from "entities/user";
import { Catalogue } from "../Catalogue/Catalogue";
import styles from "./style.module.scss";


const HomePage: FC = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const { activeTab, chooseTab } = useTabs<TFeedFilter, "All">("All");
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);
    const feedLoading = useAppSelector(selectFeedLoading);
    const { setApiPlayback } = usePlaybackAdapter();

    useEffect(() => {
        if (user === null) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user])

    useEffect(() => {
        (async () => {
            setApiPlayback?.(await fetchPlaybackState());
        })()
    }, [setApiPlayback])
    
    return (
        <div className={styles["home"]}>
            <Loader loading={feedLoading || userLoading} />
            <div className={styles["filter-bar"]}>
                <CategoryTabs<TFeedFilter> 
                    tabs={["All", "Music", "Podcasts"]}
                    activeTab={activeTab}
                    chooseTab={chooseTab}
                    className={theme}
                />
                <div className={styles["button-adjust-container"]}>
                    <AdjustContextMenu isOpen={isOpen} setIsOpen={setIsOpen} />
                    <button 
                        className={styles["button-adjust"]} 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Adjust width={40} height={40} className={styles["icon"]} />
                    </button> 
                </div> 
            </div>
            <UserTrackList />
            <Catalogue type={activeTab} />
        </div>
    )
}

export default HomePage;