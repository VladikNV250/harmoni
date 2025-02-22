import { apiInstance } from "shared/api/base";
import { IPlaylist } from "./types";

const ENDPOINT = "/v1/playlists";

export const fetchPlaylist = (playlistId: string, fields?: string | null, market?: string | null,): Promise<IPlaylist> => {
    return apiInstance.get(ENDPOINT + "/" + playlistId, {
        params: {
            fields,
            market
        }
    });
}

export const fetchSeveralPlaylists = (playlistsId: string[]): Promise<IPlaylist[]> => { // Spotify Web API doesn't allow to fetch several playlists in one request :(
    return Promise.all(playlistsId.map(id =>
        fetchPlaylist(id)
    ))
}