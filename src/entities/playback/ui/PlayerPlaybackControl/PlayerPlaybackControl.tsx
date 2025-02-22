import clsx from "clsx";
import { FC } from "react";
// import { usePlayerDevice } from "react-spotify-web-playback-sdk";
import { 
    Device, 
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
import { calculateDuration, useAppSelector } from "shared/lib";
import { Description, SeekBar, Text, VolumeBar } from "shared/ui";
import { selectDevices } from "features/device";
import "./PlayerPlaybackControl.scss";
import { usePlaybackAdapter } from "entities/playback/lib/usePlaybackAdapter";

interface IPlayerPlaybackControl {
    readonly menus: { [key: string]: boolean },
    readonly openMenu: (whatOpen: string, openState?: boolean) => void,
    readonly activeTab: "track" | "devices" | "queue",
    readonly chooseTab: (tab: "devices" | "queue" | "track") => void,
}

export const PlayerPlaybackControl: FC<IPlayerPlaybackControl> = ({ menus, openMenu, activeTab, chooseTab }) => {
    const devices = useAppSelector(selectDevices);
    const { adapter, player } = usePlaybackAdapter();
    
    const getActiveDevice = () => devices.find(device => device.is_active)?.name ?? "";


    if (adapter) return (
        <div className="player-control-bar">
            {adapter.getCurrentDevice() === "Harmoni App Player" ?
            <div className="player-seek-container">
                <SeekBar 
                    progress={adapter.getTrackPosition()}
                    trackDuration={adapter.getTrackDuration()}
                    player={player}
                />
                <div className="player-duration-container">
                    <Text className="player-duration">
                        {calculateDuration(adapter.getTrackPosition(), "colon")}
                    </Text>
                    <Text className="player-duration">
                        {`-${calculateDuration(adapter.getLeftTime(), "colon")}`}
                    </Text>
                </div>
            </div> :
            <div className="player-current-device">
                <Device width={20} height={20} />
                <Description>
                    {getActiveDevice()}
                </Description>
            </div>}
            <div className="player-control-bar-container__one">
                <button 
                    className={clsx(
                        "player-button", 
                        adapter.getShuffle() && "shuffle"
                    )}
                    onClick={() => adapter.toggleShuffle()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    <Shuffle width={50} height={50} />
                </button>
                <button 
                    className="player-button" 
                    onClick={() => adapter.previousTrack()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}    
                >
                    <Prev width={50} height={50} />
                </button>
                <button 
                    className="player-button" 
                    onClick={() => adapter.resume()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    {adapter.getIsPlaying()  
                    ? <Pause width={50} height={50} />
                    : <Play width={50} height={50} />}
                </button>
                <button 
                    className="player-button" 
                    onClick={() => adapter.nextTrack()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    <Next width={50} height={50} />
                </button>
                <button 
                    className={clsx(
                        "player-button", 
                        adapter.getRepeatMode() === "track" && "repeat-track", 
                        adapter.getRepeatMode() === "context" && "repeat-context"
                    )}
                    onClick={() => adapter.setRepeatMode()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    <Loop width={50} height={50} />
                </button>
            </div>
            <div className="player-control-bar-container__two">
                <button 
                    className={clsx("player-button", activeTab === "devices" && "player-button__active")} 
                    onClick={() => chooseTab("devices")}
                >
                    <Device width={50} height={50} />
                </button>
                <button 
                    className="player-button" 
                    onClick={() => openMenu("volumeBar")}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    <div 
                        className={clsx("player-volume-container", menus.volumeBar && "active")} 
                        onClick={e => e.stopPropagation()}
                    >
                        <VolumeBar player={player} />
                    </div>
                    <Volume width={50} height={50} />
                </button>
                <button 
                    className={clsx("player-button", activeTab === "queue" && "player-button__active")} 
                    onClick={() => chooseTab("queue")}
                >
                    <Queue width={50} height={50} />
                </button>
                <button className="player-button" onClick={() => openMenu("moreMenu", true)}>
                    <More width={50} height={50} />
                </button>
            </div>
        </div>
    )
}