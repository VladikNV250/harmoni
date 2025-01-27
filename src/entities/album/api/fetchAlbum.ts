import { apiInstance } from "shared/api/base";
import { IAlbum } from "shared/types";

const ENDPOINT = "/v1/albums/";

export const fetchAlbum = (albumId: string): Promise<IAlbum> => {
    return apiInstance.get<IAlbum>(ENDPOINT + albumId);
}