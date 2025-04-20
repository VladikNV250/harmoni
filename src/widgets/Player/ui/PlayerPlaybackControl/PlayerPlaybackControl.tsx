import { 
    FC, 
    useCallback 
} from "react";
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
import { 
    usePlay, 
    useRepeat, 
    useShuffle 
} from "widgets/Player/lib/player/player";
import { calculateDuration, useAppDispatch, useAppSelector } from "shared/lib";
import { Description, Text } from "shared/ui";
import { selectDevices } from "features/device";
import { usePlaybackAdapter } from "entities/playback";
import { selectUser } from "entities/user";
import { VolumeBar } from "../VolumeBar/VolumeBar";
import { SeekBar } from "../SeekBar/SeekBar";
import clsx from "clsx";
import styles from "./style.module.scss";
import { selectPlayerOpenedMenu } from "widgets/Player/model/selectors";
import { playerSlice } from "widgets/Player/model/playerSlice";


export const PlayerPlaybackControl: FC = () => {
    const dispatch = useAppDispatch();
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const { setOpenedMenu } = playerSlice.actions;
    const devices = useAppSelector(selectDevices);
    const user = useAppSelector(selectUser);
    const { adapter } = usePlaybackAdapter();
    
    const handleShuffle = useShuffle();
    const handleRepeat = useRepeat();
    const handlePlay = usePlay();
    
    const getActiveDevice = useCallback(
        () => devices.find(device => device.is_active)?.name ?? "", 
        [devices]
    );

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
                    onClick={() => dispatch(setOpenedMenu("device"))}
                    className={clsx(
                        styles["control-bar-button"], 
                        openedMenu === "device" && styles["active"]
                    )} 
                >
                    <Device width={50} height={50} />
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => dispatch(setOpenedMenu("volume"))}
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <div 
                        onClick={e => e.stopPropagation()}
                        className={clsx(
                            styles["volume-container"], 
                            openedMenu === "volume" && styles["active"]
                        )} 
                    >
                        <VolumeBar />
                    </div>
                    <Volume width={50} height={50} />
                </button>
                <button 
                    onClick={() => dispatch(setOpenedMenu("queue"))}
                    className={clsx(
                        styles["control-bar-button"], 
                        openedMenu === "queue" && styles["active"]
                    )} 
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                >
                    <Queue width={50} height={50} />
                </button>
                <button 
                    className={styles["control-bar-button"]} 
                    onClick={() => dispatch(setOpenedMenu("more"))}
                    disabled={!adapter.checkPlayback()}
                >
                    <More width={50} height={50} />
                </button>
            </div>
        </div>
    )
}