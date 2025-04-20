import { apiInstance } from "shared/api/base";
import { IPlaylist, IPlaylistItems } from "./types";

const ENDPOINT = "/v1/playlists";

export const fetchPlaylist = (playlistId: string, fields?: string | null, market?: string | null,): Promise<IPlaylist> => {
    return apiInstance.get(ENDPOINT + `/${playlistId}`, {
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

export const followPlaylist = (playlistId: string): Promise<void> => {
    return apiInstance.put(ENDPOINT + `/${playlistId}` + "/followers", {});
}

export const unfollowPlaylist = (playlistId: string): Promise<void> => {
    return apiInstance.delete(ENDPOINT + `/${playlistId}` + "/followers");
}

export const checkFollowedPlaylist = (playlistId: string): Promise<boolean[]> => {
    return apiInstance.get(ENDPOINT + `/${playlistId}` + "/followers/contains");
}   

export const changePlaylistDetails = (
    playlistId: string,
    body: {
        name: string,
        description?: string,
    }
): Promise<void> => {
    return apiInstance.put(ENDPOINT + `/${playlistId}`, {
        name: body.name,
        description: body.description ?? "",
    })
}

export const addCustomPlaylistCoverImage = (playlistId: string, image: string): Promise<void> => {
    return apiInstance.put(
        ENDPOINT + `/${playlistId}/images`, 
        image,
        {
            headers: {
                "Content-Type": "image/jpeg",
            }
        }
    )
}

export const fetchPlaylistItems = (
    playlistId: string,
    params?: {
        market?: string, 
        fields?: string, 
        limit?: number, 
        offset?: number, 
        additionalTypes?: string
    }
): Promise<IPlaylistItems> => {
    return apiInstance.get(ENDPOINT + `/${playlistId}/tracks`, {
        params: {
            playlist_id: playlistId,
            market: params?.market || null,
            fields: params?.fields || null,
            limit: params?.limit || null,
            offset: params?.offset || null,
            additional_types: params?.additionalTypes || null,
        }
    })
}

export const addItemsToPlaylist = (playlistId: string, trackUris: string[], position: number = 0): Promise<void> => {
    return apiInstance.post(
        ENDPOINT + `/${playlistId}/tracks`,
        {
            uris: trackUris,
            position, 
        }
    );
}

export const removePlaylistItems = (playlistId: string, trackUris: string[], snapshotId?: string): Promise<void> => {
    const tracks = trackUris.map(uri => ({ uri })); // ["x:y:1239ds", "a:b:13414as"] 
                                                    // => [{uri: "x:y:1239ds"}, {uri: "a:b:13414as"}]
    return apiInstance.delete(
        ENDPOINT + `/${playlistId}/tracks`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            data: {
                tracks,
                snapshotId: snapshotId ?? null,
            }
        }
    )
}

export const createPlaylist = (
    userId: string,
    body: {
        name: string,
        public?: boolean,
        collaborative?: boolean,
        description?: string,
    } 
): Promise<{data: IPlaylist}> => {
    const USERS_ENDPOINT = "https://api.spotify.com/v1/users";

    return apiInstance.post(
        USERS_ENDPOINT + `/${userId}/playlists`,
        {
            name: body.name,
            public: body.public ?? null,
            collaborative: body.collaborative ?? null,
            description: body.description ?? "",
        }
    )
}