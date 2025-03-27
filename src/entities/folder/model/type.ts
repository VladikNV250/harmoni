import { IPlaylist, ISimplifiedPlaylist } from "shared/api/playlist"

export interface IFolder {
    /** Type of the object */
    readonly type: "folder",
    /** Name of folder */
    readonly name: string,
    /** Id of folder */
    readonly id: string,
    /** Items of folder */
    readonly items: (IPlaylist | ISimplifiedPlaylist)[],
}

export interface IFolderState {
    folders: IFolder[];
}