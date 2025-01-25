import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "./types";
import { ErrorType, RejectedDataType } from "shared/types";
import { fetchUserInfo } from "../api/fetchUserInfo";

export const getUserInfo = createAsyncThunk<
    IUser,
    void,
    { readonly rejectValue: RejectedDataType }
>("user/fetchUserInfo", async (_, thunkAPI) => {
    try {
        const response = await fetchUserInfo();
        return response;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})