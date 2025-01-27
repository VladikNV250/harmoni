export interface IFeedState {
    feeds: IFeed[];
}

export interface IFeed {
    isPined: boolean,
    name: string,
    isHidden: boolean,
    itemType: "album"| "artist" | "playlist" | "show" | "episode",
}