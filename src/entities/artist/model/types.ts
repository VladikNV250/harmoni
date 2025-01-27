import { IArtist, RejectedDataType } from "shared/types";

export interface IArtistState {
    artists: IArtist[];
    loading: boolean;
    error: RejectedDataType | null,
}

