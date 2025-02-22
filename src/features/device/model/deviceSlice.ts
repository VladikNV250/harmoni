import { createSlice } from "@reduxjs/toolkit";
import { IDeviceState } from "./types";
import { getAvailableDevices } from "./deviceThunk";

const initialState: IDeviceState = {
    devices: [],
    loading: false,
    error: null,
}

export const deviceSlice = createSlice({
    name: "device",
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getAvailableDevices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAvailableDevices.fulfilled, (state, action) => {
                state.devices = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAvailableDevices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
})

export default deviceSlice.reducer;