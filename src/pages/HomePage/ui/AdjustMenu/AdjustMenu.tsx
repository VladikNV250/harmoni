import { FC } from "react";
import { useTheme } from "entities/theme";
import {
    FeedList,
    feedSlice,
    selectFeedUserTracks
} from "entities/feed";
import {
    BottomSheet,
    Description,
    Paragraph,
    Switch
} from "shared/ui"
import {
    useAppDispatch,
    useAppSelector,
    useWindowDimensions
} from "shared/lib";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IAdjustMenu {
    /** Controls whether menu is visible */
    readonly isOpen?: boolean;
    /** Callback to toggle the menu's visibility. */
    readonly setIsOpen: (state: boolean) => void;
}

/**
 * @component AdjustMenu
 * @description Renders a responsive menu for managing home page. 
 * Allows you to manage feeds, change the visibility of TopUserTracks.
 * - On desktop (>=768): shows a dropdown context menu.
 * - On mobile: shows a bottom sheet. 
 */
export const AdjustMenu: FC<IAdjustMenu> = ({ isOpen = false, setIsOpen, }) => {
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