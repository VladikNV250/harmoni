import { apiInstance } from "shared/api/base";
import { IEpisode } from "shared/types";
import { ISeveralEpisodes } from "./types";

const ENDPOINT = "/v1/episodes";

export const fetchEpisode = (episodeId: string): Promise<IEpisode> => {
    return apiInstance.get(ENDPOINT + "/" + episodeId);
}

export const fetchSeveralEpisodes = (episodeIds: string[]): Promise<ISeveralEpisodes> => {
    return apiInstance.get(ENDPOINT, {
        params: {
            ids: episodeIds.join(",")
        }
    });
}