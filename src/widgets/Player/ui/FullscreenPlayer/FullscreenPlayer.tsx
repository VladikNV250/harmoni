import { 
    useEffect, 
    CSSProperties, 
    FC, 
} from "react"
import clsx from "clsx"
import { useAppSelector } from "shared/lib"
import { useMenu } from "widgets/Player/lib/menu/useMenu"
import { MoreMenu } from "../MoreMenu/MoreMenu"
import { PlayerPlaybackControl } from "../PlayerPlaybackControl/PlayerPlaybackControl"
import { FullscreenHeader } from "../FullscreenHeader/FullscreenHeader"
import { ForPremiumMessage } from "../ForPremiumMessage/ForPremiumMessage"
import { FullscreenTrack } from "../FullscreenTrack/FullscrenTrack"
import { QueueList } from "features/queue"
import { DeviceList } from "features/device"
import { selectPlayerFullsreenMode } from "widgets/Player/model/selectors"
import styles from "./style.module.scss";


interface IFullscreenPlayer {
    readonly color: string,
    readonly activeTab: "track" | "devices" | "queue",
    readonly chooseTab: (tab: "devices" | "queue" | "track") => void,
}

export const FullscreenPlayer: FC<IFullscreenPlayer> = ({ color, activeTab, chooseTab }) => {
    const { menus, openMenu } = useMenu({ 
        moreMenu: false, 
        volumeBar: false, 
        artistMenu: false 
    })
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
            <MoreMenu 
                menus={menus}
                openMenu={openMenu}
            />
            <div className={styles["fullscreen-player-container"]}>
                <FullscreenHeader 
                    activeTab={activeTab}
                />
                <div className={styles["fullscreen-player-content"]}>
                    <FullscreenTrack
                        activeTab={activeTab} 
                    />
                    <QueueList 
                        activeTab={activeTab} 
                    />
                    <DeviceList 
                        activeTab={activeTab}
                        chooseTab={chooseTab}
                    />
                    <ForPremiumMessage 
                        activeTab={activeTab}
                    />
                </div>
                <PlayerPlaybackControl 
                    menus={menus}
                    openMenu={openMenu}
                    activeTab={activeTab}
                    chooseTab={chooseTab}
                />
            </div>
        </div> 
    )
}