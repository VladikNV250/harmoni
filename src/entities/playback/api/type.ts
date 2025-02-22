import { IEpisode } from "shared/api/episode"
import { ITrack } from "shared/api/track"

export interface IPlayback {
    /** The device that is currently active. */
    readonly device: {
        /** The device ID. */
        readonly id: string | null,
        /** If this device is the currently active device */
        readonly is_active: boolean,
        /** If this device is currently in a private session. */
        readonly is_private_session: boolean,
        /** Whether controlling this device is restricted. 
         * At present if this is "true" then 
         * no Web API commands will be accepted by this device. */
        readonly is_restricted: boolean,
        /** A human-readable name for the device */
        readonly name: string,
        /** Device type */
        readonly type: "computer" | "smartphone" | "speaker",
        /** The current volume in percent. */
        readonly volume_percent: number | null,
        /** If this device can be used to set the volume */
        readonly supports_volume: boolean,
    },
    /** Repeat state  */
    readonly repeat_state: "off" | "track" | "context",
    /** If shuffle is on or off */
    readonly shuffle_state: boolean,
    /** Contect Object */
    readonly context: {
        /** The object type */
        readonly type: string,
        /** A link to the Web API endpoint providing full details of the track. */
        readonly href: string,
        /** External URLs for this context. */
        readonly external_urls: {
            /** The Spotify URL for the object */
            readonly spotify: string
        },
        /** The Spotify URI for the context. */
        readonly uri: string,
    } | null,
    /** Unix Millisecond Timestamp when playback state was last changed */
    readonly timestamp: number,
    /** Progress into the currently playing track or episode. */
    readonly progress_ms: number | null,
    /** If something is currently playing, return true */
    readonly is_playing: boolean,
    /** The currently playing track or episode */
    readonly item: ITrack | IEpisode | null,
    /** The object type of the currently playing item */
    readonly currently_playing_type: "track" | "episode" | "ad" | "unknown",
    /** Allows to update the user interface based on which playback actions are available within the current context. */
    readonly actions: {
        /** Interrupting playback */
        readonly interrupting_playback?: boolean,
        /** Pausing */
        readonly pausing?: boolean,
        /** Resuming */
        readonly resuming?: boolean,
        /** Seeking playback location */
        readonly seeking?: boolean,
        /** Skipping to the next context */
        readonly skipping_next?: boolean,
        /** Skipping to the previous context */
        readonly skipping_prev?: boolean,
        /** Toggling repeat context flag. */
        readonly toggling_repeat_context?: boolean,
        /**Toggling shuffle flag  */
        readonly toggling_shuffle?: boolean,
        /** Toggling repeat track flag */
        readonly toggling_repeat_track?: boolean,
        /** Transfering playback between devices */
        readonly transferring_playback?: boolean,
    }
}



