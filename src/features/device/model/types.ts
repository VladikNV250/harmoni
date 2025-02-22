import { RejectedDataType } from "shared/types";
import { IDevice } from "../api/types";

export interface IDeviceState {
    devices: IDevice[],
    loading: boolean,
    error: RejectedDataType | null,
}