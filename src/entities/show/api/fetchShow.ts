import { apiInstance } from "shared/api/base";
import { IShow } from "shared/types";

const ENDPOINT = "/v1/shows/";

export const fetchShow = (showId: string): Promise<IShow> => {
    return apiInstance.get<IShow>(ENDPOINT + showId)
}