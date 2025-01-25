export type { IArtist, IArtistState } from "./model/types";
export { artistSlice } from "./model/artistSlice";
export { default as artistReducer } from "./model/artistSlice";
export { selectArtists } from "./model/selectors";

export { ArtistCard } from "./ui/ArtistCard";