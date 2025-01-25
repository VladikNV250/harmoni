export interface IPodcastState {
    podcasts: IPodcast[];
}

export interface IPodcast {
    type: "podcast"
    name: string,
    preview: string,
    author: string,
}