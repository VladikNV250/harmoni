import { PlaceholderImage } from "shared/assets";
import { IPlayback, IPlayTrack } from "../api/type";
import { 
    pauseTrack,
    playTrack,
    seekToPosition,
    setPlaybackVolume,
    setRepeatMode, 
    skipToNext, 
    skipToPrevious, 
    togglePlaybackShuffle 
} from "../api/playback";

export interface IPlaybackAdapter {
    checkPlayback(): boolean;
    getAlbumName(): string;
    getAlbumLink(): string;  
    getArtists(): {readonly name: string, readonly id: string}[];
    getIsPlaying(): boolean;
    getRepeatMode(): "off" | "context" | "track";
    getShuffle(): boolean;
    getTrackID(): string;
    getTrackURI(): string;
    getTrackName(): string;   
    getTrackImage(): string;
    getTrackDuration(): number;
    getTrackPosition(): number;
    getCurrentDevice(): string;
    getContextURI(): string;
    getProcessInPercent(): number;
    getLeftTime(): number;
    getVolume(): Promise<number> | number;
    play(params: IPlayTrack): Promise<void>;
    resume(): Promise<boolean>;
    nextTrack(): void;
    previousTrack(): void;
    seek(position: number): void;
    toggleShuffle(state?: boolean): boolean;
    setRepeatMode(): "off" | "context" | "track";
    setVolume(percent: number): void;
}

export class SdkPlaybackAdapter implements IPlaybackAdapter {
    constructor (
        private sdkPlayback: Spotify.PlaybackState | null,
        private player: Spotify.Player | null,
    ) {}

    checkPlayback(): boolean {
        return Boolean(this.sdkPlayback);
    }

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

    getTrackID(): string {
        return this.sdkPlayback?.track_window.current_track.id ?? ""
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

    async getVolume(): Promise<number> {
        if (this.player) {
            const volume = await this.player.getVolume();
            return volume;
        } else {
            return 0;
        }
    }

    async play(params: IPlayTrack): Promise<void> {
        await playTrack(params);
    }

    async resume(): Promise<boolean> {
        if (this.sdkPlayback?.paused) await this.player?.resume();
        else await this.player?.pause();

        return this.sdkPlayback?.paused ?? false;
    }

    nextTrack(): void {
        this.player?.nextTrack();
    }

    previousTrack(): void {
        this.player?.previousTrack();
    }

    seek(position: number): void {
        this.player?.seek(position);
    }

    toggleShuffle(state?: boolean): boolean {
        togglePlaybackShuffle(state ?? !this.sdkPlayback?.shuffle);
        return state ?? !this.sdkPlayback?.shuffle;
    }

    setRepeatMode(): "off" | "context" | "track" {
        let newMode: "off" | "context" | "track" = "off";
        switch (this.sdkPlayback?.repeat_mode) {
            case 0: newMode = "context"; break; 
            case 1: newMode = "track"; break;
            case 2: newMode = "off"; break;
            default: newMode = "off"; break;
        }
        setRepeatMode(newMode);

        return newMode;
    }

    setVolume(percent: number): void {
        if (this.player) {
            this.player.setVolume(percent / 100);
        }
    }
}

export class ApiPlaybackAdapter implements IPlaybackAdapter {
    constructor (
        private apiPlayback: IPlayback | null,
    ) {}

    checkPlayback(): boolean {
        return Boolean(this.apiPlayback);        
    }

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

    getTrackID(): string {
        return this.apiPlayback?.item?.id ?? "";
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

    getVolume(): Promise<number> | number {
        return this.apiPlayback?.device.volume_percent ?? 0;
    }

    async play(params: IPlayTrack): Promise<void> {
        await playTrack(params);
    }

    async resume(): Promise<boolean> {
        const isPlaying = this.apiPlayback?.is_playing ?? false;
        const contextUri = this.apiPlayback?.context?.uri ?? "";
        const trackUri = this.apiPlayback?.item?.uri ?? "";

        // const contextType = contextUri.split(":")[1]; // spotify:artist:219103iasd -> artist

        if (isPlaying) {
            await pauseTrack()
        } else {
            await playTrack({
                context_uri: contextUri,
                offset: {
                    uri: trackUri,
                },
            })
        }
        
        return !isPlaying;
    }

    nextTrack(): void {
        skipToNext();
    }

    previousTrack(): void {
        skipToPrevious();
    }

    seek(position: number): void {
        seekToPosition(position);
    }

    toggleShuffle(state?: boolean): boolean {
        togglePlaybackShuffle(state ?? !this.apiPlayback?.shuffle_state);

        return state ?? !this.apiPlayback?.shuffle_state;
    }

    setRepeatMode(): "off" | "context" | "track" {
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

        return newMode;
    }

    setVolume(percent: number): void {
        setPlaybackVolume(percent);
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
        } else if (apiPlayback && apiPlayback.item) {
            return new ApiPlaybackAdapter(apiPlayback);
        } else {
            return new ApiPlaybackAdapter(null);
        }
    }
}