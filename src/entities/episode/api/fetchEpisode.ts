import { apiInstance } from "shared/api/base";
import { IEpisode } from "shared/types";

const ENDPOINT = "/v1/episodes/";

export const fetchEpisode = (episodeId: string): Promise<IEpisode> => {
    return apiInstance.get<IEpisode>(ENDPOINT + episodeId);
}