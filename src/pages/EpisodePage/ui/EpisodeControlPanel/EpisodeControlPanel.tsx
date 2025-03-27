import { 
    FC, 
    useMemo,
    useState, 
} from "react";
import { 
    AddIcon, 
    AddToPlaylist, 
    AddToQueue, 
    CheckFilled, 
    Pause, 
    Play 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    addItemToQueue, 
    getUserQueue 
} from "features/queue";
import { 
    removeEpisodesFromLibrary, 
    saveEpisodesToLibrary 
} from "shared/api/user";
import { 
    createPlaylistThunk,
    getLikedEpisodes, 
    selectLikedEpisodes,
    selectSavedPlaylists, 
} from "features/library";
import { usePlaybackAdapter } from "entities/playback";
import { IEpisode } from "shared/api/episode";
import { PlaylistMenu } from "entities/playlist";
import { selectUser } from "entities/user";
import { addItemsToPlaylist, fetchPlaylistItems, IPlaylist } from "shared/api/playlist";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IEpisodeControlPanel {
    readonly episode: IEpisode | null;
}

export const EpisodeControlPanel: FC<IEpisodeControlPanel> = ({ episode }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { adapter } = usePlaybackAdapter();
    const [isOpen, setIsOpen] = useState(false);
    const user = useAppSelector(selectUser);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const libraryEpisodes = useAppSelector(selectLikedEpisodes);

    const isEpisodeInLibrary = useMemo(
        () => libraryEpisodes.findIndex(item => item.episode.id === episode?.id) !== -1,
        [libraryEpisodes, episode]
    )

    const handlePlay = async () => {
        try {
            await adapter.play({ 
                context_uri: episode?.show?.uri ?? "",
                offset: {
                    uri: episode?.uri ?? "",
                } 
            });
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const saveEpisode = async () => {
        try {
            if (isEpisodeInLibrary) {
                await removeEpisodesFromLibrary([episode?.id ?? ""]);
                toast.info("The episode have been removed from the library.");
            } else {
                await saveEpisodesToLibrary([episode?.id ?? ""]);
                toast.info("The episode have been added to the library.");
            }
            dispatch(getLikedEpisodes());
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("PLAY", e);
        }
    }

    const addToQueueHandle = async () => {
        try {
            if (!episode) throw new Error("Episode doesn't exist");
            
            await addItemToQueue(episode.uri);
            await dispatch(getUserQueue());
            toast.info("The episode have been added to the queue.");
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-ITEM-TO-QUEUE", e);
        }
    }

    const addToNewPlaylist = async () => {
        try {
            if (!user || !episode?.uri) throw new Error("User or episodeURI doesn't exist");
            const newPlaylist: IPlaylist = await dispatch(createPlaylistThunk({
                userId: user.id,
                body: {
                    name: "New Playlist #" + libraryPlaylists.length,
                }
            })).unwrap();
    
            if (newPlaylist) {
                await addItemsToPlaylist(newPlaylist.id, [episode.uri], 0);
    
                navigate(`/playlists/${newPlaylist.id}`);
                setIsOpen(false);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-NEW-PLAYLIST", e);
        }
    }

    const addToPlaylist = async (playlistId: string) => {
        try {
            if (!playlistId || !episode?.id || !episode?.uri) throw new Error("PlaylistId or EpisodeId or EpisodeURI doesn't exist");
            const playlistItems = (await fetchPlaylistItems(playlistId)).items.map(({track}) => track);

            if (playlistItems.findIndex(item => item.id === episode.id) === -1) {
                await addItemsToPlaylist(playlistId, [episode.uri], 0);
    
                setIsOpen(false);
                toast("The episode added to this playlist.");
            } else {
                toast.warn("The episode have been in this playlist already.");                
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-PLAYLIST", e);
        }
    }

    return (
        <>
            <div className={styles["episode-control-panel"]}>
                <PlaylistMenu 
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    onCreatePlaylist={addToNewPlaylist}
                    onSelectPlaylist={addToPlaylist}
                />
                <div className={styles["control-panel-button-container"]}>
                    <button 
                        className={styles["control-panel-button"]} 
                        onClick={async () => await handlePlay()}
                        >
                        {adapter.getTrackURI() === episode?.uri ?
                        <Pause width={60} height={60} /> :
                        <Play width={60} height={60} />}
                    </button>
                    <button
                        className={clsx(
                            styles["control-panel-button"],
                            isEpisodeInLibrary && styles["active"]
                        )}
                        onClick={async () => await saveEpisode()}
                    >
                        <AddIcon width={50} height={50} className={styles["icon"]} />
                        <CheckFilled width={50} height={50} className={styles["icon__active"]} />
                    </button>
                    <button className={styles["control-panel-button"]} onClick={() => setIsOpen(true)}>
                        <AddToPlaylist width={40} height={40} />
                    </button>
                    <button
                        className={styles["control-panel-button"]}
                        onClick={async () => await addToQueueHandle()}
                    >
                        <AddToQueue width={50} height={50} />
                    </button>
                </div>
            </div>
        </>
    )
}