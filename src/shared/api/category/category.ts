import { apiInstance } from "../base"
import { 
    ICategory, 
    ISeveralBrowseCategories 
} from "./types";

const ENDPOINT = "https://api.spotify.com/v1/browse/categories";

export const fetchSeveralBrowseCategories = (
    locale?: string,
    limit?: number,
    offset?: number,
): Promise<ISeveralBrowseCategories> => {
    return apiInstance.get(ENDPOINT, {
        params: {
            locale: locale || null,
            limit: limit ?? null,
            offset: offset ?? null,
        }
    })
}

export const fetchBrowseCategory = (
    category_id: string, 
    locale?: string
): Promise<ICategory> => {
    return apiInstance.get(ENDPOINT + `/${category_id}`, {
        params: {
            locale: locale || null,
        }
    })
}