import { createContext } from "react";
import { ApiPlaybackAdapter, IPlaybackAdapter } from "../lib/playbackAdapter";
import { IPlayback } from "../api/type";

interface IPlaybackContext {
    adapter: IPlaybackAdapter;
    player: Spotify.Player | null;
    apiPlayback: IPlayback | null;
    sdkPlayback: Spotify.PlaybackState | null;
    setApiPlayback?: React.Dispatch<React.SetStateAction<IPlayback | null>>;
}

export const PlaybackContext = createContext<IPlaybackContext>({
    adapter: new ApiPlaybackAdapter(null),
    player: null, 
    apiPlayback: null,
    sdkPlayback: null,
});