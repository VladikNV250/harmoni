import { IShow, RejectedDataType } from "shared/types";

export interface IShowState {
    shows: IShow[];
    loading: boolean,
    error: RejectedDataType | null,
}

