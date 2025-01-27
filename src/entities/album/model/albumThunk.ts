import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, IAlbum, RejectedDataType } from "shared/types";
import { fetchAlbum } from "../api/fetchAlbum";

export const getAlbum = createAsyncThunk<
    IAlbum,
    string,
    { readonly rejectValue: RejectedDataType }
>("album/getAlbum", async (id: string, thunkAPI) => {
    try {
        const response = await fetchAlbum(id);
        return response;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})