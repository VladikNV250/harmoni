import clsx from "clsx";
import { FC } from "react";
import { Device, Playing } from "shared/assets";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { Description, Loader } from "shared/ui";
import { getAvailableDevices } from "features/device/model/deviceThunk";
import { selectDevices, selectDevicesLoading } from "features/device/model/selectors";
import { transferPlayback, usePlaybackAdapter } from "entities/playback";
import { fetchPlaybackState } from "entities/playback/api/playback";
import { selectUser } from "entities/user";
import { PLAYBACK_NAME } from "shared/consts";
import { toast } from "react-toastify";
import styles from "./style.module.scss";


interface IDeviceList {
    readonly activeTab: "track" | "devices" | "queue",
    readonly chooseTab: (tab: "devices" | "queue" | "track") => void,
}

export const DeviceList: FC<IDeviceList> = ({ activeTab, chooseTab }) => {
    const devices = useAppSelector(selectDevices);
    const loading = useAppSelector(selectDevicesLoading);
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { setApiPlayback } = usePlaybackAdapter();

    const handleTransferDevice = async (device_id: string | null, name: string) => {
        try {
            if (name === PLAYBACK_NAME && user?.product !== "premium") {
                toast("Buy Spotify Premium to play music on Harmoni!");  
            } else {
                await transferPlayback(device_id ?? "");
                setApiPlayback?.(await fetchPlaybackState());
                dispatch(getAvailableDevices())
                chooseTab("track");
            }
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("TRANSFER DEVICE", e);
        }
    }

    return (
        <div 
            className={clsx(
                styles["fullscreen-devices"], 
                activeTab === "devices" && styles["active"]
            )}
        >
            <Loader loading={loading} />
            {devices.map(({id, name, is_active}, index) =>
                <div 
                    key={id ?? index} 
                    onClick={async () => await handleTransferDevice(id, name)}
                    className={clsx(
                        styles["fullscreen-device"], 
                        is_active && styles["active"]
                    )}
                >
                    <Device width={40} height={40} className={styles["device-icon"]} />
                    <Description className={styles["device-name"]}>
                        {name}                                        
                    </Description>
                    {is_active &&
                    <Playing width={40} height={40} style={{color: "var(--primary)"}} />}
                </div>
            )}
        </div>
    )
}