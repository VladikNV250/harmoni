export interface IAudiobookState {
    audiobooks: IAudiobook[];
}

export interface IAudiobook {
    type: "audiobook",
    name: string,
    preview: string,
    author: string,
}