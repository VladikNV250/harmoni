import { apiInstance } from "shared/api/base";
import { IPlayback } from "./type";

const ENDPOINT = "https://api.spotify.com/v1/me/player"

export const fetchPlaybackState = (): Promise<IPlayback> => {
    return apiInstance.get(ENDPOINT);
}

export const togglePlaybackShuffle = (state: boolean, device_id?: string | null): Promise<void> => {
    return apiInstance.put(ENDPOINT + "/shuffle", null, {
        params: {
            state,
            device_id: device_id || null
        }
    })
}

export const setRepeatMode = (state: "track" | "context" | "off", device_id?: string | null): Promise<void> => {
    return apiInstance.put(ENDPOINT + "/repeat", null, {
        params: {
            state,
            device_id: device_id || null,
        }
    })
}

export const transferPlayback = (device_id: string, play: boolean = true): Promise<void> => {
    return apiInstance.put(ENDPOINT, {
        device_ids: [device_id],
        play,
    })
}

export const skipToNext = (device_id?: string): Promise<{data: string}> => {
    return apiInstance.post(ENDPOINT + "/next", {}, {
        params: {
            device_id: device_id || null,
        }
    })
}

export const skipToPrevious = (device_id?: string): Promise<void> => {
    return apiInstance.post(ENDPOINT + "/next", {}, {
        params: {
            device_id: device_id || null,
        }
    })
}

