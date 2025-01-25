export interface IArtistState {
    artists: IArtist[];
}

export interface IArtist {
    type: "artist",
    name: string,
    preview: string,
}