import { apiInstance } from "shared/api/base";
import { IShow } from "shared/types";
import { ISeveralShows } from "./types";

const ENDPOINT = "/v1/shows";

export const fetchShow = (showId: string): Promise<IShow> => {
    return apiInstance.get<IShow>(ENDPOINT + "/" + showId)
}

export const fetchSeveralShows = (showIds: string[]): Promise<ISeveralShows> => {
    return apiInstance.get(ENDPOINT, {
        params: {
            ids: showIds.join(",")
        }
    });
}