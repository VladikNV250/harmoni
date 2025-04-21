import { 
    FC, 
    useMemo, 
    useState 
} from "react";
import { useNavigate } from "react-router";
import { 
    createPlaylistThunk,
    getLikedEpisodes, 
    selectLikedEpisodes, 
    selectSavedPlaylists
} from "features/library";
import { 
    addItemToQueue, 
    getUserQueue 
} from "features/queue";
import { PlaylistMenu } from "features/menus";
import { usePlaybackAdapter } from "entities/playback";
import { selectUser } from "entities/user";
import { 
    removeEpisodesFromLibrary, 
    saveEpisodesToLibrary 
} from "shared/api/user";
import { 
    addItemsToPlaylist, 
    fetchPlaylistItems, 
    IPlaylist, 
    removePlaylistItems 
} from "shared/api/playlist";
import {  IPlaylistEpisode } from "shared/api/episode";
import { Description, Paragraph } from "shared/ui";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    AddIcon,
    AddToPlaylist,
    AddToQueue, 
    CheckFilled, 
    PlaceholderImage, 
    Play, 
    RemoveIcon
} from "shared/assets";
import { toast } from "react-toastify";
import styles from "./style.module.scss";
import clsx from "clsx";


interface IPlaylistEpisodeItem {
    readonly episode: IPlaylistEpisode;
    readonly playlistId?: string;
}

export const PlaylistEpisodeItem: FC<IPlaylistEpisodeItem> = ({ episode, playlistId }) => {
    const {
        id,
        name,
        uri,
        album,
    } = episode;
    const { adapter } = usePlaybackAdapter();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const libraryEpisodes = useAppSelector(selectLikedEpisodes);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    
    const isEpisodeInLibrary = useMemo(
        () => libraryEpisodes.findIndex(item => item.episode.id === id) !== -1,
        [libraryEpisodes, id]
    )

    const handlePlay = async () => {
        try {
            await adapter.play({
                context_uri: album.uri,
                offset: {
                    uri: episode.uri
                }
            })
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }   
    }

    const saveEpisode = async () => {
        try {
            if (!id) throw new Error("Episode ID doesn't exist");

            if (isEpisodeInLibrary) {
                await removeEpisodesFromLibrary([id ?? ""]);
                toast.info("The episode have been removed from the library.");
            } else {
                await saveEpisodesToLibrary([id ?? ""]);
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
            if (!uri) throw new Error("Episode URI doesn't exist");
            
            await addItemToQueue(uri);
            await dispatch(getUserQueue());
            toast.info("The episode have been added to the queue.");
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-ITEM-TO-QUEUE", e);
        }
    }

    const addToNewPlaylist = async () => {
        try {
            if (!user || !uri) throw new Error("User or episodeURI doesn't exist");
            const newPlaylist: IPlaylist = await dispatch(createPlaylistThunk({
                userId: user.id,
                body: {
                    name: "New Playlist #" + (libraryPlaylists.length + 1),
                }
            })).unwrap();
    
            if (newPlaylist) {
                await addItemsToPlaylist(newPlaylist.id, [uri], 0);
    
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
            if (!playlistId || !id || !uri) throw new Error("PlaylistId or TrackId or TrackURI doesn't exist");
            const playlistItems = (await fetchPlaylistItems(playlistId)).items.map(({track}) => track);

            if (playlistItems.findIndex(item => item.id === id) === -1) {
                await addItemsToPlaylist(playlistId, [uri], 0);
    
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

    const removeFromPlaylist = async () => {
        try {
            if (!playlistId || !uri) throw new Error("PlaylistID or TrackURI doesn't exist.");

            await removePlaylistItems(playlistId, [uri]);
            navigate(0);
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("DELETE-FROM-PLAYLIST", e);
        }
    }

    return (
        <div className={styles["episode"]}>
            <PlaylistMenu 
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onCreatePlaylist={addToNewPlaylist}
                onSelectPlaylist={addToPlaylist}
            />
            <div 
                className={styles["episode-image-container"]} 
                onClick={() => navigate(`/episodes/${id}`)}
            >
                <img 
                    src={album.images?.[0]?.url || PlaceholderImage} 
                    className={styles["episode-image"]}    
                />
                <div className={styles["episode-body"]}>
                    <Paragraph className={styles["episode-name"]}>
                        {name ?? ""}
                    </Paragraph>
                    <Description className={styles["episode-author"]}>
                        {album.name ?? ""}
                    </Description>
                </div>
            </div>            
            <div className={`${styles["episode-control-panel"]}`}>
                <div className={styles["button-container"]}>
                    <button
                        className={clsx(
                            styles["button"],
                            isEpisodeInLibrary && styles["active"]
                        )}
                        onClick={async () => await saveEpisode()}
                    >
                        <AddIcon width={40} height={40} className={styles["icon"]} />
                        <CheckFilled width={40} height={40} className={styles["icon__active"]} />
                    </button>
                    <button className={styles["button"]} onClick={() => setIsOpen(true)}>
                        <AddToPlaylist width={40} height={40} />
                    </button>
                    <button 
                        className={styles["button"]} 
                        onClick={async () => await addToQueueHandle()}
                    >
                        <AddToQueue width={40} height={40} />
                    </button>
                    {playlistId &&
                    <button 
                        className={styles["button"]}
                        onClick={async () => await removeFromPlaylist()}    
                    >
                        <RemoveIcon width={40} height={40} />
                    </button>}
                </div>
                <div className={styles["button-container"]}>
                    <button 
                        className={styles["button"]} 
                        onClick={async () => await handlePlay()}
                    >
                        <Play width={40} height={40} />
                    </button>
                </div>
            </div>
        </div>
    )
}