import { createAsyncThunk } from "@reduxjs/toolkit";
import { IDevice } from "../api/types";
import { fetchAvailableDevices } from "../api/device";
import { ErrorType, RejectedDataType } from "shared/types";

export const getAvailableDevices = createAsyncThunk<
    IDevice[],
    void,
    {readonly rejectValue: RejectedDataType}
>("device/getAvailableDevices", async (_, thunkAPI) => {
    try {
        const response = await fetchAvailableDevices();
        return response.devices;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})