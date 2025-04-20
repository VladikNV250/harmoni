import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSeveralBrowseCategories, ICategory } from "shared/api/category";
import { ISearchParams, ISearchResult, searchForItem } from "shared/api/search";
import { ErrorType, RejectedDataType } from "shared/types";

export const searchForItemThunk = createAsyncThunk<
    ISearchResult,
    ISearchParams,
    { readonly rejectValue: RejectedDataType }
>("search/searchForItemThunk", async (params, thunkAPI) => {
    try {
        const response = await searchForItem(params);
        return response
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})

export const getSeveralBrowseCategories = createAsyncThunk<
    ICategory[],
    void,
    { readonly rejectValue: RejectedDataType }
>("search/getSeveralBrowseCategories", async (_, thunkAPI) => {
    try {
        const response = await fetchSeveralBrowseCategories();
        return response.categories.items;
    } catch (e: unknown) {
        const knownError = e as ErrorType;

        return thunkAPI.rejectWithValue({
            messageError: knownError.message,
            status: knownError.response?.status,
        })
    }
})