export interface IAlbumState {
    albums: IAlbum[];
}

export interface IAlbum {
    type: "album"
    name: string,
    preview: string,
    author: string,
}