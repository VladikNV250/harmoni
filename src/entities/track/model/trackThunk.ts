import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, ITrack, RejectedDataType } from "shared/types";
import { fetchTrack } from "../api/fetchTrack";

export const getTrack = createAsyncThunk<
    ITrack,
    string,
    { readonly rejectValue: RejectedDataType }
>("track/getTrack", async (id: string, thunkAPI) => {
    try {
        const response = await fetchTrack(id);
        return response;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})