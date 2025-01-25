import { apiInstance } from "../base"

export const fetchPlaylist = async () => {
    const response = await apiInstance.get(`/v1/playlists/3cEYpjA9oz9GiPac4AsH4n`)
    return response;
}