import { FC } from "react";
import { selectUser } from "entities/user";
import {
    Device,
    Playing
} from "shared/assets";
import {
    useAppDispatch,
    useAppSelector
} from "shared/lib";
import {
    Description,
    Loader,
    Subtitle
} from "shared/ui";
import {
    fetchPlaybackState,
    transferPlayback,
    usePlaybackAdapter
} from "entities/playback";
import { PLAYBACK_NAME } from "shared/consts";
import { IDevice } from "features/device/api/types";
import { getAvailableDevices } from "features/device/model/deviceThunk";
import {
    selectDevices,
    selectDevicesLoading
} from "features/device/model/selectors";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IDeviceList {
    /** Controls whether list is visited. */
    readonly isVisited: boolean,
    /** Called when user select device in list. */
    readonly onTransfer?: () => void,
}

/**
 * @component DeviceList
 * @description Component responsible for rendering available devices, that the user can transfer to.
 * Clicking on device user can transfer to.
 */
export const DeviceList: FC<IDeviceList> = ({ isVisited, onTransfer }) => {
    const devices = useAppSelector(selectDevices);
    const loading = useAppSelector(selectDevicesLoading);
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { setApiPlayback } = usePlaybackAdapter();

    /**
     * @function handleTransferDevice
     * @description Used for transfering playback between various devices. 
     * Without Spotify Premium, playback in the web app is not available — users can only control playback on other Spotify-connected devices. 
     * @param {string | null} device_id Id of device, which will be transfered.
     * @param {string} name Device name used to verify if the web app is the active playback device.
     */
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
            return devices.map(({ id, name, is_active }, index) =>
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
                        <Playing width={40} height={40} style={{ color: "var(--primary)" }} />}
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