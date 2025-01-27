import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, IShow, RejectedDataType } from "shared/types";
import { fetchShow } from "../api/fetchShow";

export const getShow = createAsyncThunk<
    IShow,
    string,
    { readonly rejectValue: RejectedDataType }
>("show/getShow", async (id: string, ThunkAPI) => {
    try {
        const response = await fetchShow(id);
        return response;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return ThunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})