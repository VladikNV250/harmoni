export type {
    IDevice,
} from "./api/types";

export {
    default as deviceReducer,
    deviceSlice,
} from "./model/deviceSlice";
export {
    getAvailableDevices,
} from "./model/deviceThunk";
export {
    selectDevices,
    selectDevicesError,
    selectDevicesLoading,
} from './model/selectors';

export { DeviceList } from "./ui/DeviceList/DeviceList";