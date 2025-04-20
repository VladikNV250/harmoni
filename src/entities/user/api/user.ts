import { apiInstance } from "shared/api/base"; 
import { IUser } from "./types";

const ENDPOINT = "/v1/me"

export const fetchUserInfo = (): Promise<IUser> => {
    return apiInstance.get(ENDPOINT);
}