import { FC, useCallback, useEffect } from "react";
import { 
    DragDownMenu, 
    Paragraph 
} from "shared/ui";
import { 
    AddIcon, 
    AddToPlaylist, 
    AddToQueue, 
    Album, 
    ArtistIcon, 
    CheckFilled, 
    RemoveIcon 
} from "shared/assets";
import { 
    Link, 
    useNavigate 
} from "react-router";
import { 
    useAppDispatch, 
    useAppSelector, 
    useControlPanel 
} from "shared/lib";
import { 
    ISimplifiedTrack, 
    ITrack 
} from "shared/api/track";
import { 
    addItemToQueue, 
    getUserQueue 
} from "features/queue";
import { 
    addItemsToPlaylist, 
    fetchPlaylistItems, 
    IPlaylist, 
    removePlaylistItems, 
} from "shared/api/playlist";
import { 
    createPlaylistThunk, 
    selectSavedPlaylists 
} from "features/library";
import { ISimplifiedArtist } from "shared/api/artist";
import { selectUser } from "entities/user";
import { toast } from "react-toastify";
import { checkLikedTracks } from "shared/api/user";
import { PlaylistMenu } from "entities/playlist";
import styles from "./style.module.scss";


interface ITrackMenu {
    readonly track: ITrack | ISimplifiedTrack;
    readonly isOpen: boolean,
    readonly setIsOpen: (state: boolean) => void,
    /** Playlist ID to delete track from playlist */
    readonly playlistId?: string;
}

export const TrackMenu: FC<ITrackMenu> = ({ isOpen, setIsOpen, track, playlistId }) => {
    const { uri, album, artists, id } = track as ITrack;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const { controlPanel, updateControlPanel } = useControlPanel({
        playlistMenu: false,
        artistMenu: false,
        isTrackLiked: false,
    } as Record<string, boolean>);

    const setIsTrackLiked = useCallback((state: boolean) => updateControlPanel("isTrackLiked", state), [updateControlPanel]);
    const setPlaylistMenu = (state: boolean) => updateControlPanel("playlistMenu", state);
    const setArtistMenu =   (state: boolean) => updateControlPanel("artistMenu", state);

    useEffect(() => {
        (async () => {
            if (isOpen) {
                setIsTrackLiked((await checkLikedTracks([id]))[0]);
            }
        })()
    }, [isOpen, id, setIsTrackLiked]);

    const addItemToQueueHandle = async () => {
        try {
            if (!uri) throw new Error("URI doesn't exist.");

            await addItemToQueue(uri);
            await dispatch(getUserQueue());
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-ITEM-TO-QUEUE", e);
        }
    }

    const addToNewPlaylist = async () => {
        try {
            if (!user || !uri) throw new Error("User or trackURI doesn't exist");
            const newPlaylist: IPlaylist = await dispatch(createPlaylistThunk({
                userId: user.id,
                body: {
                    name: "New Playlist #" + libraryPlaylists.length,
                }
            })).unwrap();
    
            if (newPlaylist) {
                await addItemsToPlaylist(newPlaylist.id, [uri], 0);
    
                navigate(`/playlists/${newPlaylist.id}`);
                setIsOpen(false);
                setPlaylistMenu(false);
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
                toast("The song added to this playlist.");
            } else {
                toast.warn("The song have been in this playlist already.");                
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

    const renderArtists = (artists: ISimplifiedArtist[]) => {
        return artists.map(artist => 
            <Link 
                key={artist.id} 
                to={`/artists/${artist.id}`}
                className={styles["menu-link"]}
                onClick={() => setIsOpen(false)}
            >
                <ArtistIcon width={40} height={40} />
                {artist.name}
            </Link>
        )
    }

    return (
        <div className={styles["menu-wrapper"]} onClick={e => e.stopPropagation()}>
            <DragDownMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className={styles["menu-content"]}>
                    <button 
                        className={styles["menu-button"]}
                        onClick={() => setPlaylistMenu(true)}    
                    >
                        <AddToPlaylist width={40} height={40} />
                        <Paragraph>Add to playlist</Paragraph>
                    </button>
                    {playlistId &&
                    <button 
                        className={styles["menu-button"]}
                        onClick={async () => await removeFromPlaylist()}    
                    >
                        <RemoveIcon width={40} height={40} />
                        <Paragraph>Remove from this playlist</Paragraph>
                    </button>}
                    
                    <button 
                        className={styles["menu-button"]}
                        onClick={() => setPlaylistMenu(true)}    
                    >
                        {controlPanel.isTrackLiked 
                        ?
                        <>
                            <CheckFilled width={40} height={40} />
                            <Paragraph>Remove from your Liked Songs</Paragraph>
                        </>
                        :
                        <>
                            <AddIcon width={40} height={40} />
                            <Paragraph>Save to your Liked Songs</Paragraph>
                        </>}
                    </button>
                    <button 
                        className={styles["menu-button"]} 
                        onClick={async () => await addItemToQueueHandle()}
                    >
                        <AddToQueue width={40} height={40} />
                        <Paragraph>Add to queue</Paragraph>
                    </button>
                    {album?.id &&
                    <Link 
                        to={`/albums/${album.id}`} 
                        className={styles["menu-link"]}
                    >
                        <Album width={40} height={40} />
                        <Paragraph>Go to album</Paragraph>
                    </Link>}
                    {artists.length > 1 
                    ?
                        <button 
                            className={styles["menu-button"]}
                            onClick={() => setArtistMenu(true)}
                        >
                            <ArtistIcon width={40} height={40} />
                            <Paragraph>Go to artist</Paragraph>
                        </button>
                    : artists?.[0]?.id ?
                        <Link 
                            to={`/artists/${artists?.[0].id}`}
                            className={styles["menu-link"]}
                        >
                            <ArtistIcon width={40} height={40} />
                            <Paragraph>Go to artist</Paragraph>
                        </Link>
                    : null}
                </div>
            </DragDownMenu>
            <DragDownMenu 
                className={styles["menu-artists"]} 
                isOpen={controlPanel.artistMenu} 
                setIsOpen={setArtistMenu}
            >
                <div className={styles["menu-artists-content"]}>
                    {renderArtists(artists)}
                </div>
            </DragDownMenu>
            <PlaylistMenu 
                isOpen={controlPanel.playlistMenu}
                setIsOpen={setPlaylistMenu}
                onCreatePlaylist={addToNewPlaylist}
                onSelectPlaylist={addToPlaylist}
            />
        </div>
    )
}