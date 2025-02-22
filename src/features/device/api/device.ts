import { apiInstance } from "shared/api/base";
import { IAvailableDevices } from "./types";

const ENDPOINT = "https://api.spotify.com/v1/me/player/devices";

export const fetchAvailableDevices = (): Promise<IAvailableDevices> => {
    return apiInstance.get(ENDPOINT);
}