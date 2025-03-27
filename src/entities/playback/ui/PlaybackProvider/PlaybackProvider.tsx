import { fetchPlaybackState } from "entities/playback/api/playback";
import { IPlayback } from "entities/playback/api/type";
import { PlaybackContext } from "entities/playback/config/playbackContext";
import { PlaybackAdapterFactory } from "entities/playback/lib/playbackAdapter";
import { FC, useEffect, useMemo, useState } from "react";
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk";


interface IPlaybackProvider {
    children: React.ReactNode;
}

export const PlaybackProvider: FC<IPlaybackProvider> = ({ children }) => {
    const [apiPlayback, setApiPlayback] = useState<IPlayback | null>(null);
    const sdkPlayback = usePlaybackState(true, 1000);
    const player = useSpotifyPlayer();

    const playbackAdapter = useMemo(
        () => PlaybackAdapterFactory.createAdapter(apiPlayback, sdkPlayback, player),
        [sdkPlayback, apiPlayback, player]
    );

    useEffect(() => {
        (async () => {
            setApiPlayback(await fetchPlaybackState());
        })()
    }, [])

    return (
        <PlaybackContext.Provider 
            value={{ 
                adapter: playbackAdapter, 
                player,
                apiPlayback,
                setApiPlayback,
                sdkPlayback,
            }}
        >
            {children}
        </PlaybackContext.Provider>
    );
};