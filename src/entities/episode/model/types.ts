import { IEpisode, RejectedDataType } from "shared/types";

export interface IEpisodeState {
    episodes: IEpisode[];
    loading: boolean,
    error: RejectedDataType | null;
}