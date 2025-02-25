import clsx from "clsx";
import { FC } from "react";
import { 
    Album, 
    Down, 
    Playing 
} from "shared/assets";
import { useAppDispatch } from "shared/lib";
import { Text } from "shared/ui";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


interface IFullscreenHeader {
    readonly activeTab: "track" | "devices" | "queue"
}

export const FullscreenHeader: FC<IFullscreenHeader> = ({ activeTab }) => {
    const dispatch = useAppDispatch();
    const { toggleFullscreenMode } = playerSlice.actions;
    const { adapter } = usePlaybackAdapter();

    return (
        <header className={styles["fullscreen-header"]}>
            <button 
                className={styles["fullscreen-header-button"]} 
                onClick={() => dispatch(toggleFullscreenMode())}
            >
                <Down width={40} height={40} />
            </button>
            <div className={styles["fullscreen-header-container"]}>
                <div 
                    className={clsx(
                        styles["fullscreen-header-body"], 
                        activeTab === "track" && styles["active"]
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
                        activeTab !== "track" && styles["active"]
                    )}
                >
                    <Playing width={24} height={24} style={{color: `var(--primary)`}} />
                    <Text className={styles["fullscreen-header-track-name"]}>
                        {adapter.getTrackName()}
                    </Text>
                </div>
            </div>
        </header>
    )
}