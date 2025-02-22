import { createSelector } from "@reduxjs/toolkit";
import { IDeviceState } from "./types";

const selectBase = createSelector(
    (state: RootState) => state,
    (state) => state.device, 
)

export const selectDevices = createSelector(
    selectBase,
    (state: IDeviceState) => state.devices,
)

export const selectDevicesLoading = createSelector(
    selectBase,
    (state: IDeviceState) => state.loading,
)

export const selectDevicesError = createSelector(
    selectBase,
    (state: IDeviceState) => state.error,
)