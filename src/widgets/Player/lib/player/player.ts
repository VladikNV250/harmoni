import { 
    useEffect, 
    useState 
} from "react";
import { useNavigate } from "react-router";
import { 
    createPlaylistThunk, 
    selectSavedPlaylists 
} from "features/library";
import { getAvailableDevices } from "features/device";
import { addItemToQueue } from "features/queue";
import { selectUser } from "entities/user";
import { 
    IPlayback, 
    usePlaybackAdapter 
} from "entities/playback";
import {
    checkLikedTracks,
    removeTracksFromLibrary,
    saveTracksToLibrary,
} from "shared/api/user";
import { useAppDispatch, useAppSelector } from "shared/lib";
import {
    addItemsToPlaylist,
    fetchPlaylistItems,
    IPlaylist,
} from "shared/api/playlist";
import { toast } from "react-toastify";

export const useShuffle = () => {
    const { adapter, apiPlayback, setApiPlayback } = usePlaybackAdapter();

    return () => {
        try {
            const newShuffle = adapter.toggleShuffle();

            if (apiPlayback) {
                const newApiPlayback: IPlayback = {
                    ...apiPlayback,
                    shuffle_state: newShuffle,
                };

                setApiPlayback?.(newApiPlayback);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page");
            console.error(`SHUFFLE ERROR`, e);
        }
    };
};

export const useRepeat = () => {
    const { adapter, apiPlayback, setApiPlayback } = usePlaybackAdapter();

    return () => {
        try {
            const newRepeat = adapter.setRepeatMode();

            if (apiPlayback) {
                const newApiPlayback: IPlayback = {
                    ...apiPlayback,
                    repeat_state: newRepeat,
                };

                setApiPlayback?.(newApiPlayback);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page");
            console.log("REPEAT ERROR", e);
        }
    };
};

export const usePlay = () => {
    const { adapter, apiPlayback, setApiPlayback } = usePlaybackAdapter();

    return async () => {
        try {
            const newIsPlaying = await adapter.resume();

            if (apiPlayback) {
                const newApiPlayback: IPlayback = {
                    ...apiPlayback,
                    is_playing: newIsPlaying,
                };

                setApiPlayback?.(newApiPlayback);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("PLAY", e);
        }
    };
};

export const useLike = () => {
    const { adapter } = usePlaybackAdapter();
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            if (currentTrackId !== null) {
                const isTrackLiked = (
                    await checkLikedTracks([currentTrackId])
                )[0];
                setIsLiked(isTrackLiked);
            }
        })();
    }, [currentTrackId]);

    useEffect(() => {
        if (currentTrackId !== adapter.getTrackID()) {
            setCurrentTrackId(adapter.getTrackID());
        }
    }, [adapter]);

    const handleLike = async () => {
        try {
            if (isLiked) {
                await removeTracksFromLibrary([adapter.getTrackID()]);
            } else {
                await saveTracksToLibrary([adapter.getTrackID()]);
            }
            setIsLiked(!isLiked);
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error(e);
        }
    };

    return { isLiked, handleLike };
};

export const useQueue = () => {
    const dispatch = useAppDispatch();

    return async (uri: string) => {
        if (uri === "") return;

        try {
            await addItemToQueue(uri);
            await dispatch(getAvailableDevices());
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-ITEM-TO-QUEUE", e);
        }
    };
};

export const usePlaylistActions = (callbacks?: {
    onAddToNewPlaylist?: () => void;
    onAddToPlaylist?: () => void;
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const playlists = useAppSelector(selectSavedPlaylists);
    const user = useAppSelector(selectUser);
    const { adapter } = usePlaybackAdapter();

    const addToNewPlaylist = async () => {
        try {
            const trackUri = adapter.getTrackURI();
            if (!user || !trackUri)
                throw new Error("User or trackURI doesn't exist");

            const newPlaylist: IPlaylist = await dispatch(
                createPlaylistThunk({
                    userId: user.id,
                    body: {
                        name: "New Playlist #" + (playlists.length + 1),
                    },
                })
            ).unwrap();

            if (newPlaylist) {
                await addItemsToPlaylist(newPlaylist.id, [trackUri], 0);

                navigate(`/playlists/${newPlaylist.id}`);
                callbacks?.onAddToNewPlaylist?.();
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-NEW-PLAYLIST", e);
        }
    };

    const addToPlaylist = async (playlistId: string) => {
        try {
            const trackUri = adapter.getTrackURI();
            const trackId = adapter.getTrackID();
            if (!playlistId || !trackId || !trackUri)
                throw new Error(
                    "PlaylistID or trackID or trackURI doesn't exist"
                );

            const playlistItems = (
                await fetchPlaylistItems(playlistId)
            ).items.map(({ track }) => track);

            /** Check that the track has not been added to the playlist to avoid adding the same track twice. */
            if (playlistItems.findIndex((item) => item.id === trackId) === -1) {
                await addItemsToPlaylist(playlistId, [trackUri], 0);

                toast("The song added to this playlist.");
                callbacks?.onAddToPlaylist?.();
            } else {
                toast.warn("The song have been in this playlist already.");
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-PLAYLIST", e);
        }
    };

    return { addToPlaylist, addToNewPlaylist };
};
