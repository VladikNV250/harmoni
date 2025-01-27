export type { IArtistState } from "./model/types";
export { artistSlice } from "./model/artistSlice";
export { default as artistReducer } from "./model/artistSlice";
export { 
    selectArtists,
    selectArtistLoading,
    selectArtistError, 
} from "./model/selectors";
export { getArtist } from "./model/artistThunk";

export { ArtistCard } from "./ui/ArtistCard";