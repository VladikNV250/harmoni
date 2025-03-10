import { apiInstance } from "../base";
import { ISearchParams, ISearchResult } from "./types";

const ENDPOINT = "https://api.spotify.com/v1/search";


export const searchForItem = ({
    query,
    type,
    market,
    limit,
    offset,
    include_external,  
}: ISearchParams): Promise<ISearchResult> => {
    return apiInstance.get(ENDPOINT, {
        params: {
            q: query,
            type: type.join(","),
            market: market ?? null,
            limit: limit ?? null,
            offset: offset ?? null,
            include_external: include_external ?? null,
        }
    })
}