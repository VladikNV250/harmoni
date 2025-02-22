import { PlaceholderImage } from "shared/assets";
import { IPlayback, IPlayTrack } from "../api/type";
import { 
    playTrack,
    setRepeatMode, 
    skipToNext, 
    skipToPrevious, 
    togglePlaybackShuffle 
} from "../api/playback";

export interface IPlaybackAdapter {
    getAlbumName(): string;
    getAlbumLink(): string;  
    getArtists(): {readonly name: string, readonly id: string}[];
    getIsPlaying(): boolean;
    getRepeatMode(): "off" | "context" | "track";
    getShuffle(): boolean;
    getTrackURI(): string;
    getTrackName(): string;   
    getTrackImage(): string;
    getTrackDuration(): number;
    getTrackPosition(): number;
    getCurrentDevice(): string;
    getContextURI(): string;
    getProcessInPercent(): number;
    getLeftTime(): number;
    play(params: IPlayTrack): void;
    resume(): void;
    nextTrack(): void;
    previousTrack(): void;
    toggleShuffle(state?: boolean): void;
    setRepeatMode(): void;
}

export class SdkPlaybackAdapter implements IPlaybackAdapter {
    constructor (
        private sdkPlayback: Spotify.PlaybackState | null,
        private player: Spotify.Player | null,
    ) {}

    getAlbumName(): string {
        return this.sdkPlayback?.track_window.current_track.album.name ?? "";
    }

    getAlbumLink(): string {
        const uriArr = this.sdkPlayback?.track_window.current_track.album.uri.split(":"); // ["spotify", "album", "#id"]
        const type = uriArr?.[1];
        const id = uriArr?.[2];

        switch(type) {
            case "album": return `/albums/${id}`;
            case "show": return `/shows/${id}`;
            default: return "";
        }
    }

    getArtists(): { readonly name: string; readonly id: string; }[] {
        return this.sdkPlayback?.track_window.current_track.artists.map(artist => {
            const uriArr = artist.uri.split(":"); // ["spotify", "artist", "#id"]
            const id = uriArr?.[2];
            
            return {
                name: artist.name, 
                id: id
            }
        }) ?? [];
    }

    getIsPlaying(): boolean {
        return !this.sdkPlayback?.paused;
    }

    getRepeatMode(): "off" | "context" | "track" {
        switch (this.sdkPlayback?.repeat_mode) {
            case 0: return "off";
            case 1: return "context";
            case 2: return "track";
            default: return "off";
        }
    }

    getShuffle(): boolean {
        return this.sdkPlayback?.shuffle ?? false;
    }   

    getTrackURI(): string {
        return this.sdkPlayback?.track_window.current_track.uri ?? "";
    }

    getTrackName(): string {
        return this.sdkPlayback?.track_window.current_track.name ?? "";
    }

    getTrackImage(): string {
        return this.sdkPlayback?.track_window.current_track.album.images[0].url ?? PlaceholderImage;
    }

    getTrackDuration(): number {
        return this.sdkPlayback?.track_window.current_track.duration_ms ?? 1;
    }

    getTrackPosition(): number {
        return this.sdkPlayback?.position ?? 0;
    }

    getCurrentDevice(): string {
        return "Harmoni App Player";
    }

    getContextURI(): string {
        return this.sdkPlayback?.context.uri ?? "";
    }

    getProcessInPercent(): number {
        const duration: number = this.sdkPlayback?.track_window.current_track.duration_ms ?? 1;
        const position: number = this.sdkPlayback?.position ?? 0;

        return Math.floor((position * 100) / duration);
    }

    getLeftTime(): number {
        const duration: number = this.sdkPlayback?.track_window.current_track.duration_ms ?? 1;
        const position: number = this.sdkPlayback?.position ?? 0;

        return duration - position;
    }

    play(params: IPlayTrack): void {
        playTrack(params);
    }

    resume(): void {
        if (this.sdkPlayback?.paused) this.player?.resume();
        else this.player?.pause();
    }

    nextTrack(): void {
        this.player?.nextTrack();
    }

    previousTrack(): void {
        this.player?.previousTrack();
    }

    toggleShuffle(state?: boolean) {
        togglePlaybackShuffle(state ?? !this.sdkPlayback?.shuffle);
    }

    setRepeatMode(): void {
        let newMode: "off" | "context" | "track" = "off";
        switch (this.sdkPlayback?.repeat_mode) {
            case 0: newMode = "context"; break; 
            case 1: newMode = "track"; break;
            case 2: newMode = "off"; break;
            default: newMode = "off"; break;
        }
        setRepeatMode(newMode);
    }
}

export class ApiPlaybackAdapter implements IPlaybackAdapter {
    constructor (
        private apiPlayback: IPlayback | null,
    ) {}

    getAlbumName(): string {
        switch (this.apiPlayback?.item?.type) {
            case "track": return this.apiPlayback.item.album.name;
            case "episode": return this.apiPlayback.item.show.name ?? "";
            default: return "";
        }
    }

    getAlbumLink(): string {
        switch (this.apiPlayback?.item?.type) {
            case "track": return `/albums/${this.apiPlayback.item.album.id}`;
            case "episode": return `/shows/${this.apiPlayback?.item?.show.id}`;
            default: return "";
        }
    }

    getArtists(): { readonly name: string; readonly id: string; }[] {
        switch (this.apiPlayback?.item?.type) {
            case "track":
                return this.apiPlayback.item.artists.map(artist => ({
                    name: artist.name ?? "",
                    id: artist.id ?? "",
                }))
            case "episode":
                return [{
                    name: this.apiPlayback.item.show.publisher,
                    id: this.apiPlayback.item.show.id,
                }];
            default: return [];
        }
    }

    getIsPlaying(): boolean {
        return this.apiPlayback?.is_playing ?? false;
    }

    getRepeatMode(): "off" | "context" | "track" {
        return this.apiPlayback?.repeat_state ?? "off";
    }

    getShuffle(): boolean {
        return this.apiPlayback?.shuffle_state ?? false;
    }

    getTrackURI(): string {
        return this.apiPlayback?.item?.uri ?? "";
    }

    getTrackName(): string {
        return this.apiPlayback?.item?.name ?? "";
    }

    getTrackImage(): string {
        switch (this.apiPlayback?.item?.type) {
            case "track": return this.apiPlayback.item.album.images[0].url;
            case "episode": return this.apiPlayback.item.show.images[0].url;
            default: return PlaceholderImage;
        }
    }

    getTrackDuration(): number {
        return this.apiPlayback?.item?.duration_ms ?? 1;
    }

    getTrackPosition(): number {
        return this.apiPlayback?.progress_ms ?? 0;
    }

    getCurrentDevice(): string {
        return this.apiPlayback?.device?.id ?? "";
    }

    getContextURI(): string {
        return this.apiPlayback?.context?.uri ?? "";
    }

    getProcessInPercent(): number {
        const duration = this.apiPlayback?.item?.duration_ms ?? 1;
        const position = this.apiPlayback?.progress_ms ?? 0;

        return Math.floor((position * 100) / duration);
    }

    getLeftTime(): number {
        const duration = this.apiPlayback?.item?.duration_ms ?? 1;
        const position = this.apiPlayback?.progress_ms ?? 0;

        return duration - position;
    }

    play(params: IPlayTrack): void {
        playTrack(params);
    }

    resume(): void {
        const contextUri = this.apiPlayback?.context?.uri ?? "";
        const trackUri = this.apiPlayback?.item?.uri ?? "";

        playTrack({
            context_uri: contextUri ?? "",
            offset: {
                uri: trackUri,
            }
        })
    }

    nextTrack(): void {
        skipToNext();
    }

    previousTrack(): void {
        skipToPrevious();
    }

    toggleShuffle(state?: boolean): void {
        togglePlaybackShuffle(state ?? !this.apiPlayback?.shuffle_state)
    }

    setRepeatMode(): void {
        let newMode: "track" | "context" | "off" = "off";
        switch (this.apiPlayback?.repeat_state) {
            case "off": 
                newMode = "track";
                break;
            case "track":
                newMode = "context";
                break;
            case "context":
                newMode = "off";
                break;
            default: newMode = "off";
        }
        setRepeatMode(newMode);
    }
}

export class PlaybackAdapterFactory {
    static createAdapter(
        apiPlayback: IPlayback | null,
        sdkPlayback: Spotify.PlaybackState | null,
        player: Spotify.Player | null,
    ) {
        if (sdkPlayback && sdkPlayback.track_window.current_track) {
            return new SdkPlaybackAdapter(sdkPlayback, player);
        } else {
            return new ApiPlaybackAdapter(apiPlayback);
        }
    }
}