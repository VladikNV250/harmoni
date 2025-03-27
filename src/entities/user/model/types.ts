import { RejectedDataType } from "shared/types";
import { IUser } from "../api/types";

export interface IUserState {
    user: IUser | null,
    loading: boolean,
    error: RejectedDataType | null;
}