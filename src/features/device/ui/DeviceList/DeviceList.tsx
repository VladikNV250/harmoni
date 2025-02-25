import clsx from "clsx";
import { FC } from "react";
import { Device, Playing } from "shared/assets";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { Description, Loader } from "shared/ui";
import { getAvailableDevices } from "features/device/model/deviceThunk";
import { selectDevices, selectDevicesLoading } from "features/device/model/selectors";
import { transferPlayback } from "entities/playback";
import styles from "./style.module.scss";


interface IDeviceList {
    readonly activeTab: "track" | "devices" | "queue",
    readonly chooseTab: (tab: "devices" | "queue" | "track") => void,
}

export const DeviceList: FC<IDeviceList> = ({ activeTab, chooseTab }) => {
    const devices = useAppSelector(selectDevices);
    const loading = useAppSelector(selectDevicesLoading);
    const dispatch = useAppDispatch();

    const handleTransferDevice = async (device_id: string | null) => {
        transferPlayback(device_id ?? "");
        dispatch(getAvailableDevices())
        chooseTab("track");
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
                    onClick={() => handleTransferDevice(id)}
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