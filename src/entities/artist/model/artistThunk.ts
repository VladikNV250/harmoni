import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, IArtist, RejectedDataType } from "shared/types";
import { fetchArtist } from "../api/fetchArtist";

export const getArtist = createAsyncThunk<
    IArtist,
    string,
    { readonly rejectValue: RejectedDataType }
>("artist/getArtist", async (artistId: string, thunkAPI) => {
    try {
        const response = await fetchArtist(artistId);
        return response;
    } catch (e: unknown) {
        const knownError = e as ErrorType;
        
        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})