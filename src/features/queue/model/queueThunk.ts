import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserQueue } from "../api/queue";
import { ErrorType, RejectedDataType } from "shared/types";
import { IQueue } from "../api/types";

export const getUserQueue = createAsyncThunk<
    IQueue,
    void,
    {readonly rejectValue: RejectedDataType}
>("queue/getUserQueue", async (_, thunkAPI) => {
    try {
        const response = await fetchUserQueue();
        return response;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})