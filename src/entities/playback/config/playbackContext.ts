import { createContext } from "react";
import { ApiPlaybackAdapter, IPlaybackAdapter } from "../lib/playbackAdapter";

interface IPlaybackContext {
    adapter: IPlaybackAdapter;
    player: Spotify.Player | null;
}

export const PlaybackContext = createContext<IPlaybackContext>({
    adapter: new ApiPlaybackAdapter(null),
    player: null, 
});