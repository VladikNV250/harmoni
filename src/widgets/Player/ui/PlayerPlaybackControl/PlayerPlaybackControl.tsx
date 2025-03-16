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
import { Description, Text } from "shared/ui";
import { selectDevices } from "features/device";
import { IPlayback, usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";
import { selectUser } from "entities/user";
import { VolumeBar } from "../VolumeBar/VolumeBar";
import { SeekBar } from "../SeekBar/SeekBar";
import { toast } from "react-toastify";


interface IPlayerPlaybackControl {
    readonly menus: { [key: string]: boolean },
    readonly openMenu: (whatOpen: string, openState?: boolean) => void,
    readonly activeTab: "track" | "devices" | "queue",
    readonly chooseTab: (tab: "devices" | "queue" | "track") => void,
}

export const PlayerPlaybackControl: FC<IPlayerPlaybackControl> = ({ menus, openMenu, activeTab, chooseTab }) => {
    const devices = useAppSelector(selectDevices);
    const user = useAppSelector(selectUser);
    const { adapter, apiPlayback, setApiPlayback } = usePlaybackAdapter();
    
    const getActiveDevice = () => devices.find(device => device.is_active)?.name ?? "";

    const handleShuffle = () => {
        try {
            const newShuffle = adapter.toggleShuffle();

            if (apiPlayback) {
                const newApiPlayback: IPlayback = { 
                    ...apiPlayback, 
                    shuffle_state: newShuffle, 
                };
    
                setApiPlayback?.(newApiPlayback);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page");
            console.error(`SHUFFLE ERROR`, e);
        }
    }

    const handleRepeat = () => {
        try {
            const newRepeat = adapter.setRepeatMode();

            if (apiPlayback) {
                const newApiPlayback: IPlayback = { 
                    ...apiPlayback, 
                    repeat_state: newRepeat, 
                };
    
                setApiPlayback?.(newApiPlayback);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page");
            console.log("REPEAT ERROR", e)
        }
        
    }

    const handlePlay = async () => {
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
            toast.error("Something went wrong. Try again or reload the page");
            console.error("PLAY ERROR", e);
        }   
    }

    if (adapter) return (
        <div className={styles["control-bar"]}>
            
            {user?.product === "premium" 
            ?
            <div className={styles["seek-container"]}>
                <SeekBar />
                <div className={styles["duration-container"]}>
                    <Text>
                        {calculateDuration(adapter.getTrackPosition(), "colon")}
                    </Text>
                    <Text>
                        {`-${calculateDuration(adapter.getLeftTime(), "colon")}`}
                    </Text>
                </div>
            </div> 
            :
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
                    onClick={handleShuffle}
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <Shuffle width={50} height={50} />
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => adapter.previousTrack()}
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <Prev width={50} height={50} />
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={async () => await handlePlay()}
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    {adapter.getIsPlaying()  
                    ? <Pause width={50} height={50} />
                    : <Play width={50} height={50} />}
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => adapter.nextTrack()}
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <Next width={50} height={50} />
                </button>
                <button 
                    className={clsx(
                        styles["control-bar-button"], 
                        adapter.getRepeatMode() === "track" && styles["repeat-track"], 
                        adapter.getRepeatMode() === "context" && styles["repeat-context"]
                    )}
                    onClick={handleRepeat}
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <Loop width={50} height={50} />
                </button>
            </div>
            <div className={styles["control-bar-container__two"]}>
                <button 
                    onClick={() => {
                        openMenu("volumeBar", false);
                        chooseTab("devices");
                    }}
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
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <div 
                        onClick={e => e.stopPropagation()}
                        className={clsx(
                            styles["volume-container"], 
                            menus.volumeBar && styles["active"]
                        )} 
                    >
                        <VolumeBar />
                    </div>
                    <Volume width={50} height={50} />
                </button>
                <button 
                    onClick={() => {
                        openMenu("volumeBar", false);
                        chooseTab("queue");
                    }}
                    className={clsx(
                        styles["control-bar-button"], 
                        activeTab === "queue" && styles["active"]
                    )} 
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <Queue width={50} height={50} />
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => {
                        openMenu("volumeBar", false);
                        openMenu("moreMenu", true)
                    }}
                    disabled={!adapter.checkPlayback()}
                >
                    <More width={50} height={50} />
                </button>
            </div>
        </div>
    )
}