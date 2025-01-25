export interface IFeedState {
    feeds: IFeed[];
}

export interface IFeed {
    isPined: boolean,
    name: string,
    isHidden: boolean,
    itemType: "playlist" | "artist" | "podcast" | "audiobook" | "album",
}