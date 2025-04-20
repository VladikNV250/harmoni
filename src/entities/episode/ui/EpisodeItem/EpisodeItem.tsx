import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { IEpisode, ISimplifiedEpisode } from "shared/api/episode";
import { Description, Paragraph, Subtitle } from "shared/ui";
import { getDate } from "entities/episode/lib/getDate";
import { 
    calculateDuration, 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    AddIcon,
    AddToPlaylist,
    AddToQueue, 
    CheckFilled, 
    Pause, 
    PlaceholderImage, 
    Play, 
} from "shared/assets";
import { 
    createPlaylistThunk,
    getLikedEpisodes, 
    selectLikedEpisodes, 
    selectSavedPlaylists
} from "features/library";
import { 
    removeEpisodesFromLibrary, 
    saveEpisodesToLibrary 
} from "shared/api/user";
import { usePlaybackAdapter } from "entities/playback";
import { toast } from "react-toastify";
import clsx from "clsx";
import { addItemToQueue, getUserQueue } from "features/queue";
import { addItemsToPlaylist, fetchPlaylistItems, IPlaylist } from "shared/api/playlist";
import { PlaylistMenu } from "entities/playlist";
import { selectUser } from "entities/user";
import styles from "./style.module.scss";


interface IEpisodeItem {
    readonly episode: IEpisode | ISimplifiedEpisode;
    readonly showURI: string;
}

export const EpisodeItem: FC<IEpisodeItem> = ({ episode, showURI }) => {
    const {
        description,
        duration_ms,
        id,
        images,
        name,
        release_date,
        release_date_precision,
        uri,
    } = episode
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
            if (adapter.getContextURI() === showURI) {
                await adapter.resume();
            } else {
                await adapter.play({
                    context_uri: showURI,
                    offset: {
                        uri: episode.uri
                    }
                })
            }
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

    return (
        <div className={styles["episode"]}>
            <div 
                className={styles["episode-image-container"]} 
                onClick={() => navigate(`/episodes/${id}`)}
            >
                <img 
                    src={images?.[0]?.url || PlaceholderImage} 
                    className={styles["episode-image"]}    
                />
                <div className={styles["episode-body"]}>
                    <Paragraph className={styles["episode-name"]}>
                        {name ?? ""}
                    </Paragraph>
                    <Subtitle className={styles["episode-name__desktop"]}>
                        {name ?? ""}
                    </Subtitle>
                    <div className={styles["episode-content__desktop"]}>
                        <Description>
                            {getDate(release_date, release_date_precision)}
                        </Description>
                        <p>&#183;</p>
                        <Description>
                            {calculateDuration(duration_ms)}
                        </Description>
                    </div>
                    <Description className={styles["episode-description"]}>
                        {description ?? ""}
                    </Description>
                    <div 
                        className={`${styles["episode-control-panel__desktop"]}`}
                        onClick={(e) => e.stopPropagation()}
                    >
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
                            <button className={styles["button"]} onClick={() => setIsOpen(!isOpen)}>
                                <PlaylistMenu 
                                    className={styles["playlist-menu"]}
                                    isOpen={isOpen}
                                    setIsOpen={setIsOpen}
                                    onCreatePlaylist={addToNewPlaylist}
                                    onSelectPlaylist={addToPlaylist}
                                />
                                <AddToPlaylist width={40} height={40} />
                            </button>
                            <button 
                                className={styles["button"]} 
                                onClick={async () => await addToQueueHandle()}
                            >
                                <AddToQueue width={40} height={40} />
                            </button>
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
            </div>
            <div className={styles["episode-content"]}>
                <Description>
                    {getDate(release_date, release_date_precision)}
                </Description>
                <p>&#183;</p>
                <Description>
                    {calculateDuration(duration_ms)}
                </Description>
            </div>
            <div 
                className={`${styles["episode-control-panel"]}`}
                onClick={(e) => e.stopPropagation()}
            >
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
                    <button className={styles["button"]} onClick={() => setIsOpen(!isOpen)}>
                        <PlaylistMenu 
                            className={styles["playlist-menu"]}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            onCreatePlaylist={addToNewPlaylist}
                            onSelectPlaylist={addToPlaylist}
                        />
                        <AddToPlaylist width={40} height={40} />
                    </button>
                    <button 
                        className={styles["button"]} 
                        onClick={async () => await addToQueueHandle()}
                    >
                        <AddToQueue width={40} height={40} />
                    </button>
                </div>
                <div className={styles["button-container"]}>
                    <button 
                        className={styles["button"]} 
                        onClick={async () => await handlePlay()}
                    >
                        {adapter.getTrackURI() === uri && adapter.getIsPlaying() ?
                        <Pause width={40} height={40} /> :
                        <Play width={40} height={40} />}
                    </button>
                </div>
            </div>
        </div>
    )
}