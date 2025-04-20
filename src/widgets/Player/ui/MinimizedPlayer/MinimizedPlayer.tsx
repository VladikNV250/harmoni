import { 
    CSSProperties, 
    FC, 
} from "react";
import { 
    AddToQueue,
    Device,
    Like, 
    LikeFilled, 
    PauseSimple,
    PlaySimple
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector, 
    usePress 
} from "shared/lib";
import { 
    usePlay, 
    useQueue 
} from "widgets/Player/lib/player/player";
import { Description } from "shared/ui";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { fetchPlaybackState, usePlaybackAdapter } from "entities/playback";
import { selectUser } from "entities/user";
import { PLAYBACK_NAME } from "shared/consts";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IMinimizedPlayer {
    readonly color: string,
    readonly isLiked: boolean,
    readonly handleLike: () => Promise<void>;
}

export const MinimizedPlayer: FC<IMinimizedPlayer> = ({ color, isLiked, handleLike }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { toggleFullscreenMode, setOpenedMenu } = playerSlice.actions;
    const { isPressed, startPress, endPress, clearPressTime } = usePress();
    const { adapter, setApiPlayback } = usePlaybackAdapter();
     
    const addItemToQueueHandle = useQueue();
    const handlePlay = usePlay();

    const handleClick = async () => {
        if (!isPressed) {
            dispatch(setOpenedMenu("track"))
            dispatch(toggleFullscreenMode());
            setApiPlayback?.(await fetchPlaybackState());
        } 
    }

    return (
        <div 
            className={styles["minimized-player"]}
            onMouseLeave={endPress}            
            style={{"--color": color} as CSSProperties}>
            {isPressed && adapter.checkPlayback() && 
            <div className={styles["minimized-player-options"]} onClick={endPress}>
                <button 
                    className={styles["option-button"]}
                    onClick={async () => await addItemToQueueHandle(adapter.getTrackURI())}
                >
                    <AddToQueue width={40} height={40} />
                </button>
                <button 
                    className={clsx(
                        styles["option-button"],
                        isLiked && styles["liked"],
                    )}
                    onClick={async () => await handleLike()}
                >
                    <LikeFilled width={40} height={40} className={styles["icon-like__filled"]} />
                    <Like width={40} height={40} className={styles["icon-like"]} />
                </button>
            </div>}
            <div 
                className={styles["minimized-player-track"]}
                onClick={async () => await handleClick()}
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
                        { adapter.checkPlayback() 
                        ? adapter.getTrackName()
                        : PLAYBACK_NAME}
                    </Description>
                    <Description className={styles["track-artist"]}>
                        { adapter.checkPlayback()
                        ? adapter.getArtists().map(artist => artist.name).join(", ")
                        : "Play the track in one of the apps where Spotify is currently available"}
                    </Description>
                </div>
                <button 
                    className={styles["track-button"]} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        dispatch(toggleFullscreenMode()); 
                        dispatch(setOpenedMenu("device"));
                    }}
                >
                    <Device width={40} height={40} />
                </button>
                {adapter.checkPlayback() 
                &&
                <button 
                    className={styles["track-button"]} 
                    disabled={user?.product !== "premium"}
                    onClick={async (e) => {
                        e.stopPropagation();
                        await handlePlay()
                    }}
                >
                    {adapter.getIsPlaying()
                    ? <PauseSimple width={40} height={40} />
                    : <PlaySimple width={40} height={40} />}
                </button>}
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