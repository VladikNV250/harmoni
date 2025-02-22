import { RejectedDataType } from "shared/types";
import { IQueue } from "../api/types";

export interface IQueueState {
    queue: IQueue | null,
    loading: boolean,
    error: RejectedDataType | null,
}