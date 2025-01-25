import { createSlice } from "@reduxjs/toolkit";
import { IUserState } from "./types";
import { getUserInfo } from "./userThunk";

const initialState: IUserState = {
    user: null,
    loading: false,
    error: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => 
        builder
            .addCase(getUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? null;
            })
})

export default userSlice.reducer;