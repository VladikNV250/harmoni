import { PLAYLIST_SORT_TYPES, TRACK_SORT_TYPES } from "./sort";

export type TSortOrder = "Ascending" | "Descending";

export type TTrackSortBy = (typeof TRACK_SORT_TYPES)[number];
export type TPlaylistSortBy = (typeof PLAYLIST_SORT_TYPES)[number];