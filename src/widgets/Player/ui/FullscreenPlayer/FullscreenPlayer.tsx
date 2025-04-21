import {
    useEffect,
    CSSProperties,
    FC,
} from "react"
import { QueueList } from "features/queue"
import { DeviceList } from "features/device"
import {
    useAppDispatch,
    useAppSelector
} from "shared/lib"
import {
    selectPlayerFullsreenMode,
    selectPlayerOpenedMenu
} from "widgets/Player/model/selectors"
import { playerSlice } from "widgets/Player/model/playerSlice"
import { MoreMenu } from "../MoreMenu/MoreMenu"
import { PlayerPlaybackControl } from "../PlayerPlaybackControl/PlayerPlaybackControl"
import { FullscreenHeader } from "../FullscreenHeader/FullscreenHeader"
import { ForPremiumMessage } from "../ForPremiumMessage/ForPremiumMessage"
import { FullscreenTrack } from "../FullscreenTrack/FullscrenTrack"
import clsx from "clsx"
import styles from "./style.module.scss";


interface IFullscreenPlayer {
    /** Primary color of current cover image of the track. */
    readonly color: string,
    /** Controls whether track is saved in the library. */
    readonly isLiked: boolean,
    /** Callback to save or remove track from the library. */
    readonly handleLike: () => Promise<void>;
}

/**
 * @component FullscreenPlayer
 * @description Mobile-only fullscreen player component that expands from the minimized player.
 * 
 * Displays extended track info, playback controls, like button, queue and device menus,
 * and other playback-related features in an immersive fullscreen layout.
 */
export const FullscreenPlayer: FC<IFullscreenPlayer> = ({ color, isLiked, handleLike }) => {
    const dispatch = useAppDispatch();
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const { setOpenedMenu } = playerSlice.actions;
    const fullscreen = useAppSelector(selectPlayerFullsreenMode);

    useEffect(() => {
        document.body.style.overflowY = fullscreen ? "hidden" : "auto"
    }, [fullscreen])

    return (
        <div
            className={clsx(
                styles["fullscreen-player"],
                fullscreen && styles["active"]
            )}
            style={{ "--color": color } as CSSProperties}
        >
            <MoreMenu />
            <div className={styles["fullscreen-player-container"]}>
                <FullscreenHeader />
                <div className={styles["fullscreen-player-content"]}>
                    <FullscreenTrack
                        isLiked={isLiked}
                        handleLike={handleLike}
                    />
                    <QueueList isVisited={openedMenu === "queue"} />
                    <DeviceList
                        isVisited={openedMenu === "device"}
                        onTransfer={() => dispatch(setOpenedMenu("track"))}
                    />
                    <ForPremiumMessage />
                </div>
                <PlayerPlaybackControl />
            </div>
        </div>
    )
}