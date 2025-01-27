import { apiInstance } from "shared/api/base";

export const fetchAlbumTracks = (albumId: string, limit: number = 20, offset: number = 0, market?: string) => {
    const endpoint = `/v1/albums/${albumId}/tracks`;
    return apiInstance.get(endpoint, {
        params: {
            limit,
            offset,
            market
        }
    })    
}