import { apiInstance } from "../base"
import { IPlayTrack } from "./types"

const ENDPOINT = "https://api.spotify.com/v1/me/player"

export const playTrack = ({context_uri, offset, position_ms, device_id} : IPlayTrack): Promise<void> => {
    return apiInstance.put(ENDPOINT + "/play", 
    {
        context_uri,
        offset: offset ?? null,
        position_ms: position_ms ?? null,
    }, 
    {
        params: {
            device_id: device_id || null,
        }
    })
}