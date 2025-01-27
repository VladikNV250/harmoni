import { ITrack, RejectedDataType } from "shared/types";

export interface ITrackState {
    tracks: ITrack[];
    loading: boolean,
    error: RejectedDataType | null;
}