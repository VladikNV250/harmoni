import { apiInstance } from "shared/api/base"; 
import { 
    ILibraryAlbums, 
    ILibraryArtists, 
    ILibraryPlaylists, 
    ILibraryShows, 
    ILikedTracks, 
    IUserTopItems 
} from "./types";


const ENDPOINT = "/v1/me";

export const followUsers = (userIds: string[]): Promise<void> => {
    return apiInstance.put(ENDPOINT + "/following", 
        {
            ids: userIds ?? null,
        }, 
        {
            params: {
                type: "user",
                ids: userIds.join(',') || null,
            }
        }
    )
}

export const unfollowUsers = (userIds: string[]): Promise<void> => {
    return apiInstance.delete(ENDPOINT + "/following", {
        params: {
            type: "user",
            ids: userIds.join(',') || null,
        }
    })
} 

export const checkFollowedUsers = (userIds: string[]): Promise<boolean[]> => {
    return apiInstance.get(ENDPOINT + "/following/contains", {
        params: {
            type: "user",
            ids: userIds.join(',') || null
        }
    })
}

export const fetchUserTopArtists = (): Promise<IUserTopItems> => {
    return apiInstance.get(ENDPOINT + "/top/artists");
}

export const fetchUserTopTracks = (options: {
    readonly limit?: number,
    readonly offset?: number,
    readonly time_range?: string,
} = {}): Promise<IUserTopItems> => {
    return apiInstance.get(ENDPOINT + "/top/tracks", {
        params: {
            limit: options.limit ?? null,
            offset: options.offset ?? null,
            time_range: options.time_range ?? null,
        }
    });
}

export const fetchLibraryAlbums = (): Promise<ILibraryAlbums> => {
    return apiInstance.get(ENDPOINT + "/albums");
}

export const saveAlbumsToLibrary = (albumIds: string[]): Promise<void> => {
    return apiInstance.put(ENDPOINT + "/albums", {}, {
        params: {
            ids: albumIds.join(",") || null,
        }
    })
}

export const removeAlbumsFromLibrary = (albumIds: string[]): Promise<void> => {
    return apiInstance.delete(ENDPOINT + "/albums", {
        params: {
            ids: albumIds.join(",") || null,
        }
    })
}

export const checkSavedAlbums = (albumIds: string[]): Promise<boolean[]> => {
    return apiInstance.get(ENDPOINT + "/albums/contains", {
        params: {
            ids: albumIds.join(",") || null,
        }
    })
}

export const fetchLibraryPlaylists = (): Promise<ILibraryPlaylists> => {
    return apiInstance.get(ENDPOINT + "/playlists");
}

export const fetchLibraryShows = (): Promise<ILibraryShows> => {
    return apiInstance.get(ENDPOINT + "/shows");
}

export const saveShowsToLibrary = (showIds: string[]): Promise<void> => {
    return apiInstance.put(ENDPOINT + "/shows", {}, {
        params: {
            ids: showIds.join(",") || null,
        }
    })
}

export const removeShowsFromLibrary = (showIds: string[]): Promise<void> => {
    return apiInstance.delete(ENDPOINT + "/shows", {
        params: {
            ids: showIds.join(",") || null,
        }
    })
}

export const checkSavedShows = (showIds: string[]): Promise<boolean[]> => {
    return apiInstance.get(ENDPOINT + "/shows/contains", {
        params: {
            ids: showIds.join(",") || null,
        }
    })
}

export const fetchLibraryArtists = (): Promise<ILibraryArtists> => {
    return apiInstance.get(ENDPOINT + "/following", {
        params: {
            type: "artist"
        }
    })
}

export const followArtists = (artistIds: string[]): Promise<void> => {
    return apiInstance.put(ENDPOINT + "/following", 
        {
            ids: artistIds ?? null,
        }, 
        {
            params: {
                type: "artist",
                ids: artistIds.join(',') || null,
            }
        }
    )
}

export const unfollowArtists = (artistIds: string[]): Promise<void> => {
    return apiInstance.delete(ENDPOINT + "/following", {
        params: {
            type: "artist",
            ids: artistIds.join(',') || null,
        }
    })
} 

export const checkFollowedArtists = (artistIds: string[]): Promise<boolean[]> => {
    return apiInstance.get(ENDPOINT + "/following/contains", {
        params: {
            type: "artist",
            ids: artistIds.join(',') || null
        }
    })
}

export const fetchLikedTracks = (): Promise<ILikedTracks> => {
    return apiInstance.get(ENDPOINT + "/tracks");
} 

export const saveTracksToLibrary = (trackIds: string[]): Promise<void> => {
    return apiInstance.put(ENDPOINT + "/tracks", {}, {
        params: {
            ids: trackIds.join(',') || null
        }
    })
}

export const removeTracksFromLibrary = (trackIds: string[]): Promise<void> => {
    return apiInstance.delete(ENDPOINT + "/tracks", {
        params: {
            ids: trackIds.join(',') || null
        }
    })
}

export const checkLikedTracks = (trackIds: string[]): Promise<boolean[]> => {
    return apiInstance.get(ENDPOINT + "/tracks/contains", {
        params: {
            ids: trackIds.join(',') || null
        }
    })
}