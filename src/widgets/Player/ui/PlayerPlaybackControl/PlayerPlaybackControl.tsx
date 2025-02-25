import clsx from "clsx";
import { FC } from "react";
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
import { usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


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
        <div className={styles["control-bar"]}>
            {adapter.getCurrentDevice() === "Harmoni App Player" ?
            <div className={styles["seek-container"]}>
                <SeekBar 
                    progress={adapter.getTrackPosition()}
                    trackDuration={adapter.getTrackDuration()}
                    player={player}
                />
                <div className={styles["duration-container"]}>
                    <Text>
                        {calculateDuration(adapter.getTrackPosition(), "colon")}
                    </Text>
                    <Text>
                        {`-${calculateDuration(adapter.getLeftTime(), "colon")}`}
                    </Text>
                </div>
            </div> :
            <div className={styles["current-device"]}>
                <Device width={20} height={20} />
                <Description>
                    {getActiveDevice()}
                </Description>
            </div>}
            <div className={styles["control-bar-container__one"]}>
                <button 
                    className={clsx(
                        styles["control-bar-button"], 
                        adapter.getShuffle() && styles["shuffle"]
                    )}
                    onClick={() => adapter.toggleShuffle()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    <Shuffle width={50} height={50} />
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => adapter.previousTrack()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}    
                >
                    <Prev width={50} height={50} />
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => adapter.resume()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    {adapter.getIsPlaying()  
                    ? <Pause width={50} height={50} />
                    : <Play width={50} height={50} />}
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => adapter.nextTrack()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    <Next width={50} height={50} />
                </button>
                <button 
                    className={clsx(
                        styles["control-bar-button"], 
                        adapter.getRepeatMode() === "track" && styles["repeat-track"], 
                        adapter.getRepeatMode() === "context" && styles["repeat-context"]
                    )}
                    onClick={() => adapter.setRepeatMode()}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    <Loop width={50} height={50} />
                </button>
            </div>
            <div className={styles["control-bar-container__two"]}>
                <button 
                    onClick={() => chooseTab("devices")}
                    className={clsx(
                        styles["control-bar-button"], 
                        activeTab === "devices" && styles["active"]
                    )} 
                >
                    <Device width={50} height={50} />
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => openMenu("volumeBar")}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    <div 
                        onClick={e => e.stopPropagation()}
                        className={clsx(
                            styles["volume-container"], 
                            menus.volumeBar && styles["active"]
                        )} 
                    >
                        <VolumeBar player={player} />
                    </div>
                    <Volume width={50} height={50} />
                </button>
                <button 
                    onClick={() => chooseTab("queue")}
                    className={clsx(
                        styles["control-bar-button"], 
                        activeTab === "queue" && styles["active"]
                    )} 
                >
                    <Queue width={50} height={50} />
                </button>
                <button className={styles["control-bar-button"]} onClick={() => openMenu("moreMenu", true)}>
                    <More width={50} height={50} />
                </button>
            </div>
        </div>
    )
}