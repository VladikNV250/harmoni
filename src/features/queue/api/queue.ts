import { apiInstance } from "shared/api/base";
import { IQueue } from "./types";

const ENDPOINT = "https://api.spotify.com/v1/me/player/queue"

export const fetchUserQueue = (): Promise<IQueue> => {
    return apiInstance.get(ENDPOINT);
}

export const addItemToQueue = (uri: string, device_id?: string): Promise<void> => {
    return apiInstance.post(ENDPOINT, {}, {
        params: {
            uri,
            device_id: device_id || null
        }
    })
}