import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, RejectedDataType } from "shared/types";
import { fetchUserInfo } from "../api/user";
import { IUser } from "../api/types";

export const getUserInfo = createAsyncThunk<
    IUser,
    void,
    { readonly rejectValue: RejectedDataType }
>("user/getUserInfo", async (_, thunkAPI) => {
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