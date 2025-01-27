import { apiInstance } from "shared/api/base";
import { IPlaylist } from "shared/types";

const ENDPOINT = "/v1/playlists/";

export const fetchPlaylist = (playlistId: string, fields?: string | null, market?: string | null,): Promise<IPlaylist> => {
    return apiInstance.get<IPlaylist>(ENDPOINT + playlistId, {
        params: {
            fields,
            market
        }
    });
}