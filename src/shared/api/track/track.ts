import { apiInstance } from "shared/api/base";
import { ITrack } from "shared/types";

const ENDPOINT = "/v1/tracks";

export const fetchTrack = (trackId: string): Promise<ITrack> => {
    return apiInstance.get(ENDPOINT + "/" + trackId);
}