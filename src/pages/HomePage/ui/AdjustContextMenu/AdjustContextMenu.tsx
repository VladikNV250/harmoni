import { FC } from "react";
import { Description, DragDownMenu, Paragraph, Switch } from "shared/ui"
import { AddSimple } from "shared/assets";
import { useTheme } from "entities/theme";
import { FeedList, feedSlice, selectFeedUserTracks } from "entities/feed";
import { useAppDispatch, useAppSelector } from "shared/lib";
import styles from "./style.module.scss";

interface IAdjustContextMenu {
    readonly isOpen?: boolean;
    readonly setIsOpen?: (isOpen: boolean) => void;
}

export const AdjustContextMenu: FC<IAdjustContextMenu> = ({ isOpen = false, setIsOpen }) => {
    const { theme } = useTheme();
    const userTracks = useAppSelector(selectFeedUserTracks);
    const dispatch = useAppDispatch();
    const { setShowForUser } = feedSlice.actions;

    return (
        <DragDownMenu isOpen={isOpen} setIsOpen={setIsOpen} className={theme}>
            <div className={styles["menu-container"]} onClick={(e) => e.stopPropagation()}>
                <Paragraph className={styles["menu-title"]}>Customize Feed</Paragraph>
                <div className={styles["menu-line"]} />
                <div className={styles["menu-scroll-container"]}>
                    <button 
                        className={styles["menu-button"]} 
                        >
                        <AddSimple width={40} height={40} className={styles["button-icon"]} />
                        Select from Library
                    </button>
                    <FeedList />
                    <div className={styles["menu-content"]}>
                        <Description className={styles["menu-text"]}>
                            Allow Displaying User Tracks
                        </Description>
                        <Switch 
                            active={userTracks.showForUser}
                            setActive={(active: boolean) => dispatch(setShowForUser(active))} 
                            disabled={userTracks.items.length === 0}
                        />
                    </div>
                </div>
            </div>
        </DragDownMenu>
    )
}