import clsx from "clsx";
import { FC } from "react";
import { Device, Playing } from "shared/assets";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { Description, Loader, Subtitle } from "shared/ui";
import { getAvailableDevices } from "features/device/model/deviceThunk";
import { selectDevices, selectDevicesLoading } from "features/device/model/selectors";
import { fetchPlaybackState, transferPlayback, usePlaybackAdapter } from "entities/playback";
import { selectUser } from "entities/user";
import { PLAYBACK_NAME } from "shared/consts";
import { toast } from "react-toastify";
import styles from "./style.module.scss";
import { IDevice } from "features/device/api/types";


interface IDeviceList {
    readonly isVisited: boolean,
    readonly onTransfer?: () => void,
}

export const DeviceList: FC<IDeviceList> = ({ isVisited, onTransfer }) => {
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
                onTransfer?.();
            }
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("TRANSFER DEVICE", e);
        }
    }

    const renderDeviceItems = (devices: IDevice[]) => {
        if (devices.length > 0) {
            return devices.map(({id, name, is_active}, index) =>
                <div 
                    key={id ?? index} 
                    onClick={async () => await handleTransferDevice(id, name)}
                    className={clsx(
                        styles["device-item"], 
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
            )
        } else {
            return (
                <Subtitle className={styles["devices-empty"]}>
                    No devices available. Make sure your devices are connected and try again.
                </Subtitle>
            )
        }
    }

    return (
        <div 
            className={clsx(
                styles["devices-list-container"], 
                isVisited && styles["active"]
            )}
        >
            <Subtitle className={styles["devices-title"]}>
                Devices
            </Subtitle>
            <Loader loading={loading} />
            <div className={styles["devices-list"]}>
                {renderDeviceItems(devices)}
            </div>
        </div>
    )
}