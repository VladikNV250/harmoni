import { FC } from "react";
import { BottomSheet, Description, Paragraph, Switch } from "shared/ui"
import { useTheme } from "entities/theme";
import { FeedList, feedSlice, selectFeedUserTracks } from "entities/feed";
import { useAppDispatch, useAppSelector, useWindowDimensions } from "shared/lib";
import styles from "./style.module.scss";
import clsx from "clsx";

interface IAdjustContextMenu {
    readonly isOpen?: boolean;
    readonly setIsOpen: (state: boolean) => void;
}

export const AdjustContextMenu: FC<IAdjustContextMenu> = ({ isOpen = false, setIsOpen, }) => {
    const { theme } = useTheme();
    const userTracks = useAppSelector(selectFeedUserTracks);
    const dispatch = useAppDispatch();
    const { setShowForUser } = feedSlice.actions;
    const { width } = useWindowDimensions();

    return (
        width >= 768 
        ?
        <div className={clsx(
            styles["context-menu"],
            isOpen && styles["active"]
        )}>
            <div className={styles["menu-container"]} onClick={(e) => e.stopPropagation()}>
                <header className={styles["menu-header"]}>
                    <Paragraph className={styles["menu-title"]}>Customize Feed</Paragraph>
                    <div className={styles["menu-line"]} />
                </header>
                <div className={styles["menu-scroll-container"]}>
                    <FeedList />
                    <div className={styles["menu-content"]}>
                        <Description className={styles["menu-text"]}>
                            Allow Displaying User Tracks
                        </Description>
                        <Switch 
                            active={userTracks?.showForUser ?? false}
                            setActive={(active: boolean) => dispatch(setShowForUser(active))} 
                            disabled={(userTracks?.items?.length ?? 0) === 0}
                        />
                    </div>
                </div>
            </div>
        </div>
        :
        <BottomSheet
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className={theme}
        >
            <div className={styles["menu-container"]} onClick={(e) => e.stopPropagation()}>
                <Paragraph className={styles["menu-title"]}>Customize Feed</Paragraph>
                <div className={styles["menu-line"]} />
                <div className={styles["menu-scroll-container"]}>
                    <FeedList />
                    <div className={styles["menu-content"]}>
                        <Description className={styles["menu-text"]}>
                            Allow Displaying User Tracks
                        </Description>
                        <Switch 
                            active={userTracks?.showForUser ?? false}
                            setActive={(active: boolean) => dispatch(setShowForUser(active))} 
                            disabled={(userTracks?.items?.length ?? 0) === 0}
                        />
                    </div>
                </div>
            </div>
        </BottomSheet>
    )
}