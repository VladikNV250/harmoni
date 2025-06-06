import {
    CSSProperties,
    FC,
} from "react";
import { DeviceList } from "features/device";
import { QueueList } from "features/queue";
import { usePlaybackAdapter } from "entities/playback";
import { selectUser } from "entities/user";
import {
    Device,
    Like,
    LikeFilled,
    Loop,
    More,
    Next,
    Pause,
    Play,
    Prev,
    Queue,
    Shuffle,
    Volume
} from "shared/assets";
import {
    calculateDuration,
    useAppDispatch,
    useAppSelector,
} from "shared/lib";
import { Description, Text } from "shared/ui";
import { PLAYBACK_NAME } from "shared/consts";
import {
    usePlay,
    useRepeat,
    useShuffle
} from "widgets/Player/lib/player/player";
import { selectPlayerOpenedMenu } from "widgets/Player/model/selectors";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { SeekBar } from "../SeekBar/SeekBar";
import { VolumeBar } from "../VolumeBar/VolumeBar";
import { MoreMenu } from "../MoreMenu/MoreMenu";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IDesktopPlayer {
    /** Primary color of current cover image of the track. */
    readonly color: string,
    /** Controls whether track is saved in the library. */
    readonly isLiked: boolean,
    /** Callback to save or remove track from the library. */
    readonly handleLike: () => Promise<void>;
}

/**
 * @component DesktopPlayer
 * @description Full-featured audio player component for desktop layout.
 * 
 * Handles playback controls (play, pause, next, previous), shuffle and repeat modes,
 * track progress and volume control, liking/unliking tracks, and opening contextual menus 
 * such as device selector, queue, and more options.
 * 
 * Displays current track details including cover image, title, artist(s), and album name.
 * Also manages interaction logic based on user’s subscription status (e.g., premium-only features).
 */
export const DesktopPlayer: FC<IDesktopPlayer> = ({ color, isLiked, handleLike }) => {
    const dispatch = useAppDispatch();
    const { setOpenedMenu } = playerSlice.actions;
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const user = useAppSelector(selectUser);
    const { adapter } = usePlaybackAdapter();

    const handlePlay = usePlay();
    const handleShuffle = useShuffle();
    const handleRepeat = useRepeat();

    return (
        <div className={styles["desktop-player"]} style={{ "--color": color } as CSSProperties}>
            <MoreMenu isLiked={isLiked} handleLike={handleLike} />
            <DeviceList isVisited={openedMenu === "device"} />
            <QueueList isVisited={openedMenu === "queue"} />
            <div className={styles["desktop-player-container"]}>
                <div className={styles["button-container__one"]}>
                    <button
                        className={styles["player-button"]}
                        onClick={async () => await handlePlay()}
                        disabled={user?.product !== "premium"}
                    >
                        {adapter.getIsPlaying()
                            ? <Pause width={40} height={40} />
                            : <Play width={40} height={40} />}
                    </button>
                    <button
                        className={styles["player-button"]}
                        onClick={() => adapter.previousTrack()}
                        disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                    >
                        <Prev width={40} height={40} />
                    </button>
                    <button
                        className={styles["player-button"]}
                        onClick={() => adapter.nextTrack()}
                        disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                    >
                        <Next width={40} height={40} />
                    </button>
                    <button
                        className={clsx(
                            styles["player-button"],
                            adapter.getShuffle() && styles["shuffle"]
                        )}
                        onClick={handleShuffle}
                        disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                    >
                        <Shuffle width={40} height={40} />
                    </button>
                    <button
                        className={clsx(
                            styles["player-button"],
                            adapter.getRepeatMode() === "track" && styles["repeat-track"],
                            adapter.getRepeatMode() === "context" && styles["repeat-context"]
                        )}
                        onClick={handleRepeat}
                        disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                    >
                        <Loop width={40} height={40} />
                    </button>
                </div>
                <div className={styles["seek-container"]}>
                    <Text>
                        {calculateDuration(adapter.getTrackPosition(), "colon")}
                    </Text>
                    <SeekBar />
                    <Text>
                        {`-${calculateDuration(adapter.getLeftTime(), "colon")}`}
                    </Text>
                </div>
                <button
                    className={styles["player-button"]}
                    onClick={() => dispatch(setOpenedMenu("volume"))}
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <div
                        className={clsx(
                            styles["volume-container"],
                            openedMenu === "volume" && styles["active"]
                        )}
                    >
                        <VolumeBar />
                    </div>
                    <Volume width={40} height={40} />
                </button>
                <img
                    src={adapter.getTrackImage()}
                    className={styles["player-track-image"]}
                />
                <div className={styles["player-track-body"]}>
                    <Description className={styles["player-track-name"]}>
                        {adapter.checkPlayback()
                            ? adapter.getTrackName()
                            : PLAYBACK_NAME}
                    </Description>
                    <Description className={styles["player-track-artist"]}>
                        {adapter.checkPlayback()
                            ? adapter.getArtists().map(artist => artist.name).join(", ")
                            : "Play the track in one of the apps where Spotify is currently available"}
                    </Description>
                    <Description className={styles["player-track-album"]}>
                        {adapter.getAlbumName()}
                    </Description>
                </div>
                <div className={styles["button-container__two"]}>
                    <button
                        className={clsx(
                            styles["player-button"],
                            isLiked && styles["liked"],
                        )}
                        onClick={async () => await handleLike()}
                        disabled={user?.product !== "premium" || !adapter.checkPlayback()}

                    >
                        <LikeFilled width={40} height={40} className={styles["icon-like__filled"]} />
                        <Like width={40} height={40} className={styles["icon-like"]} />
                    </button>
                    <button
                        className={clsx(styles["player-button"])}
                        onClick={() => dispatch(setOpenedMenu("device"))}
                    >
                        <Device width={40} height={40} />
                    </button>
                    <button
                        className={clsx(styles["player-button"])}
                        disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                        onClick={() => dispatch(setOpenedMenu("queue"))}
                    >
                        <Queue width={40} height={40} />
                    </button>
                    <button
                        className={styles["player-button"]}
                        onClick={() => dispatch(setOpenedMenu("more"))}
                    >
                        <More width={40} height={40} />
                    </button>
                </div>
            </div>
        </div>
    )
}