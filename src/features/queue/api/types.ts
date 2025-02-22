import { IEpisode } from "shared/api/episode";
import { ITrack } from "shared/api/track";

export interface IQueue {
    /** The currently playing track or episode.  */
    readonly currently_playing: ITrack | IEpisode | null,
    /** The tracks or episodes in the queue. */
    readonly queue: (ITrack | IEpisode)[],
}