import { 
    useEffect, 
    CSSProperties, 
    FC, 
} from "react"
import clsx from "clsx"
import { useAppSelector } from "shared/lib"
import { MoreMenu } from "../MoreMenu/MoreMenu"
import { useMenu } from "widgets/Player/lib/menu/useMenu"
import { FullscreenHeader } from "../FullscreenHeader/FullscreenHeader"
import { FullscreenTrack } from "../FullscreenTrack/FullscrenTrack"
import { QueueList } from "features/queue"
import { DeviceList } from "features/device"
import { ForPremiumMessage } from "../ForPremiumMessage/ForPremiumMessage"
import { PlayerPlaybackControl } from "entities/playback"
import "./FullscreenPlayer.scss";
import { selectPlayerFullsreenMode } from "widgets/Player/model/selectors"

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
            className={clsx("fullscreen-player", fullscreen && "active")} 
            style={{"--color": color} as CSSProperties}
        >
            <MoreMenu 
                menus={menus}
                openMenu={openMenu}
            />
            <div className="fullscreen-container">
                <FullscreenHeader 
                    activeTab={activeTab}
                />
                <div className="fullscreen-content">
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