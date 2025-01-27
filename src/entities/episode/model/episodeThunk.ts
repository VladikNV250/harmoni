import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, IEpisode, RejectedDataType } from "shared/types";
import { fetchEpisode } from "../api/fetchEpisode";

export const getEpisode = createAsyncThunk<
    IEpisode,
    string,
    { readonly rejectValue: RejectedDataType }
>("episode/getEpisode", async (id: string, thunkAPI) => {
    try {
        const response = await fetchEpisode(id);
        return response;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})