import { 
    CSSProperties, 
    FC, 
    MouseEvent,
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
import { Description } from "shared/ui";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { IPlayback, usePlaybackAdapter } from "entities/playback";
import { selectUser } from "entities/user";
import { toast } from "react-toastify";
import { removeTracksFromLibrary, saveTracksToLibrary } from "shared/api/user";
import { addItemToQueue } from "features/queue";
import { getAvailableDevices } from "features/device";
import { fetchPlaybackState } from "entities/playback/api/playback";
import { PLAYBACK_NAME } from "shared/consts";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IMinimizedPlayer {
    readonly color: string,
    readonly chooseTab: (tab: "devices" | "queue" | "track") => void,
    readonly isLiked: boolean,
    readonly setIsLiked: (state: boolean) => void;
}

export const MinimizedPlayer: FC<IMinimizedPlayer> = ({ color, chooseTab, isLiked, setIsLiked }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { toggleFullscreenMode } = playerSlice.actions;
    const { isPressed, startPress, endPress, clearPressTime } = usePress();
    const { adapter, apiPlayback, setApiPlayback } = usePlaybackAdapter();
     
    const handleClick = async () => {
        if (!isPressed) {
            dispatch(toggleFullscreenMode());
            setApiPlayback?.(await fetchPlaybackState());
        } 
    }

    const addItemToQueueHandle = async (uri: string) => {
        if (uri === "") return;

        try {
            await addItemToQueue(uri);
            await dispatch(getAvailableDevices());
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-ITEM-TO-QUEUE", e);
        }
    }

    const handlePlay = async (e: MouseEvent) => {
        e.stopPropagation();

        try {
            const newIsPlaying = await adapter.resume();

            if (apiPlayback) {
                const newApiPlayback: IPlayback = {
                    ...apiPlayback,
                    is_playing: newIsPlaying
                }
    
                setApiPlayback?.(newApiPlayback);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("PLAY", e);
        }
    }

    const handleLike = async () => {
        try {
            if (isLiked) {
                await removeTracksFromLibrary([adapter.getTrackID()]);
            } else {
                await saveTracksToLibrary([adapter.getTrackID()]);
            }
            setIsLiked(!isLiked);
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error(e)
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
                        chooseTab("devices")
                    }}
                >
                    <Device width={40} height={40} />
                </button>
                {adapter.checkPlayback() 
                &&
                <button 
                    className={styles["track-button"]} 
                    onClick={async (e) => await handlePlay(e)}
                    disabled={user?.product !== "premium"}
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