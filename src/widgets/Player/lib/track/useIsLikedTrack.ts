import { IPlaybackAdapter } from "entities/playback";
import { useEffect, useState } from "react";
import { checkLikedTracks } from "shared/api/user";

export const useIsLikedTrack = (adapter: IPlaybackAdapter) => {
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            if (currentTrackId !== null) {
                const isTrackLiked = (await checkLikedTracks([currentTrackId]))[0];
                setIsLiked(isTrackLiked);
            }
        })()
    }, [currentTrackId])

    useEffect(() => {
        if (currentTrackId !== adapter.getTrackID()) {
            setCurrentTrackId(adapter.getTrackID());
        }        
    }, [adapter]);

    return { isLiked, setIsLiked }
}