import { IAlbum, RejectedDataType } from "shared/types";

export interface IAlbumState {
    albums: IAlbum[];
    loading: boolean,
    error: RejectedDataType | null;
}