import { 
    CSSProperties, 
    FC, 
    MouseEvent
} from "react";
import { 
    Device,
    Hide, 
    Like, 
    PauseSimple,
    PlaySimple
} from "shared/assets";
import { 
    useAppDispatch, 
    usePress 
} from "shared/lib";
import { Description } from "shared/ui";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


interface IMinimizedPlayer {
    readonly color: string,
    readonly chooseTab: (tab: "devices" | "queue" | "track") => void,
}

export const MinimizedPlayer: FC<IMinimizedPlayer> = ({ color, chooseTab }) => {
    const dispatch = useAppDispatch();
    const { toggleFullscreenMode } = playerSlice.actions;
    const { isPressed, startPress, endPress, clearPressTime } = usePress();
    const { adapter } = usePlaybackAdapter();

    const handleClick = () => {
        if (!isPressed) dispatch(toggleFullscreenMode());
    }

    const handlePlay = (e: MouseEvent) => {
        e.stopPropagation();
        adapter.resume();
    }

    if (adapter.checkPlayback()) return (
        <div 
            className={styles["minimized-player"]}
            onMouseLeave={endPress}            
            style={{"--color": color} as CSSProperties}>
            {isPressed && 
            <div className={styles["minimized-player-options"]} onClick={endPress}>
                <button className={styles["option-button"]}>
                    <Hide width={40} height={40} />
                </button>
                <button className={styles["option-button"]}>
                    <Like width={40} height={40} />
                </button>
            </div>}
            <div 
                className={styles["minimized-player-track"]}
                onClick={handleClick}
                onMouseDown={startPress}
                onMouseUp={clearPressTime}
                onTouchStart={startPress}
                onTouchEnd={clearPressTime}>
                <img 
                    src={adapter.getTrackImage()} 
                    className={styles["track-image"]} 
                />
                <div className={styles["track-body"]}>
                    <Description className={styles["track-name"]}>
                        {adapter.getTrackName()}
                    </Description>
                    <Description className={styles["track-artist"]}>
                        {adapter.getArtists().map(artist => artist.name).join(", ")}
                    </Description>
                </div>
                <button className={styles["track-button"]} onClick={(e) => {
                    e.stopPropagation(); 
                    dispatch(toggleFullscreenMode()); 
                    chooseTab("devices")
                }}>
                    <Device width={40} height={40} />
                </button>
                <button 
                    className={styles["track-button"]} 
                    onClick={handlePlay}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    {adapter.getIsPlaying()
                    ? <PauseSimple width={40} height={40} />
                    : <PlaySimple width={40} height={40} />}
                </button>
                <div className={styles["track-progress-bar-container"]}>
                    <div 
                        className={styles["track-progress-bar"]} 
                        style={{
                            width: `${adapter.getProcessInPercent()}%`
                        }} 
                    />
                </div>
            </div>
        </div>
    )
}