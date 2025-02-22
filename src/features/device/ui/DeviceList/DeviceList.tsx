import clsx from "clsx";
import { FC } from "react";
import { Device, Playing } from "shared/assets";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { Description, Loader } from "shared/ui";
import { getAvailableDevices } from "features/device/model/deviceThunk";
import "./DeviceList.scss";
import { selectDevices, selectDevicesLoading } from "features/device/model/selectors";
import { transferPlayback } from "entities/playback";

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
        <div className={clsx("fullscreen-devices", activeTab === "devices" && "fullscreen-devices__active")}>
            <Loader loading={loading} />
            {devices.map(({id, name, is_active}, index) =>
                <div 
                    key={id ?? index} 
                    className={clsx("fullscreen-device", is_active && "active")}
                    onClick={() => handleTransferDevice(id)}
                >
                    <Device width={40} height={40} className="device-icon" />
                    <Description className="device-name">
                        {name}                                        
                    </Description>
                    {is_active &&
                    <Playing width={40} height={40} style={{color: "var(--primary)"}} />}
                </div>
            )}
        </div>
    )
}