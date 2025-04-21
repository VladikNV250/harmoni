import { FC } from "react";
import { usePlaybackAdapter } from "entities/playback";
import { 
    Album, 
    DownIcon, 
    Playing 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { Text } from "shared/ui";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { selectPlayerOpenedMenu } from "widgets/Player/model/selectors";
import clsx from "clsx";
import styles from "./style.module.scss";


/**
 * @component FullscreenHeader
 * @description Component responsible for rendering the top of fullscreen player. 
 * Allows you to close player, display track name or track album name.
 */
export const FullscreenHeader: FC = () => {
    const dispatch = useAppDispatch();
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const { toggleFullscreenMode } = playerSlice.actions;
    const { adapter } = usePlaybackAdapter();

    return (
        <header className={styles["fullscreen-header"]}>
            <button 
                className={styles["fullscreen-header-button"]} 
                onClick={() => dispatch(toggleFullscreenMode())}
            >
                <DownIcon width={40} height={40} />
            </button>
            {adapter.checkPlayback()
            ?
            <div className={styles["fullscreen-header-container"]}>
                <div 
                    className={clsx(
                        styles["fullscreen-header-body"], 
                        openedMenu === "track" && styles["active"]
                    )}
                >
                    <Album width={24} height={24} />
                    <Text className={styles["fullscreen-header-album"]}>
                        {adapter.getAlbumName()} 
                    </Text>
                </div>
                <div 
                    className={clsx(
                        styles["fullscreen-header-body"], 
                        openedMenu !== "track" && styles["active"]
                    )}
                >
                    <Playing width={24} height={24} style={{color: `var(--primary)`}} />
                    <Text className={styles["fullscreen-header-track-name"]}>
                        {adapter.getTrackName()}
                    </Text>
                </div>
            </div>
            : null}
        </header>
    )
}