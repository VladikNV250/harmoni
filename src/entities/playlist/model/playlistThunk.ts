import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorType, IPlaylist, RejectedDataType } from "shared/types";
import { fetchPlaylist } from "../api/fetchPlaylist";

export const getPlaylist = createAsyncThunk<
    IPlaylist,
    { id: string, fields?: string, market?: string },
    { readonly rejectValue: RejectedDataType }
>("playlist/getPlaylist", async ({id, fields, market}, thunkAPI) => {
    try {
        const response = await fetchPlaylist(id, fields, market);
        return response;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})