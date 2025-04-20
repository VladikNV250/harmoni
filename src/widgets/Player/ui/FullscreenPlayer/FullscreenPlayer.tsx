import { 
    useEffect, 
    CSSProperties, 
    FC, 
} from "react"
import clsx from "clsx"
import { useAppDispatch, useAppSelector } from "shared/lib"
import { MoreMenu } from "../MoreMenu/MoreMenu"
import { PlayerPlaybackControl } from "../PlayerPlaybackControl/PlayerPlaybackControl"
import { FullscreenHeader } from "../FullscreenHeader/FullscreenHeader"
import { ForPremiumMessage } from "../ForPremiumMessage/ForPremiumMessage"
import { FullscreenTrack } from "../FullscreenTrack/FullscrenTrack"
import { QueueList } from "features/queue"
import { DeviceList } from "features/device"
import { selectPlayerFullsreenMode, selectPlayerOpenedMenu } from "widgets/Player/model/selectors"
import styles from "./style.module.scss";
import { playerSlice } from "widgets/Player/model/playerSlice"


interface IFullscreenPlayer {
    readonly color: string,
    readonly isLiked: boolean,
    readonly handleLike: () => Promise<void>;
}

export const FullscreenPlayer: FC<IFullscreenPlayer> = ({ color, isLiked, handleLike }) => {
    const dispatch = useAppDispatch();
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const { setOpenedMenu } = playerSlice.actions;
    const fullscreen = useAppSelector(selectPlayerFullsreenMode);

    useEffect(() => {
        document.body.style.overflowY = fullscreen ?  "hidden" : "auto"
    }, [fullscreen])

    return (
        <div 
            className={clsx(
                styles["fullscreen-player"], 
                fullscreen && styles["active"]
            )} 
            style={{"--color": color} as CSSProperties}
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