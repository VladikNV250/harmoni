import { Album, ArtistIcon, FolderIcon, PlaylistIcon, PodcastIcon } from "shared/assets";
import { ILibraryFilterOptions } from "../model/types";

export const LIBRARY_FILTER_OPTIONS: ILibraryFilterOptions[] = [
    { name: "Folders", Icon: FolderIcon, filter: "folder"},
    { name: "Playlists", Icon: PlaylistIcon, filter: "playlist" },
    { name: "Albums", Icon: Album, filter: "album"},
    { name: "Podcasts", Icon: PodcastIcon, filter: "show"},
    { name: "Artists", Icon: ArtistIcon, filter: "artist"},
];