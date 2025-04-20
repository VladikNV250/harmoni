import { 
    FC, 
    useEffect, 
    useMemo, 
} from "react";
import { useNavigate } from "react-router";
import { 
    AddIcon, 
    AddToPlaylist, 
    CheckFilled, 
    Pause, 
    Play, 
    Shuffle 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector, 
    useControlPanel
} from "shared/lib";
import { 
    createPlaylistThunk, 
    getLibraryAlbums, 
    selectSavedAlbums, 
    selectSavedPlaylists 
} from "features/library";
import { 
    removeAlbumsFromLibrary, 
    saveAlbumsToLibrary 
} from "shared/api/user";
import { 
    addItemsToPlaylist, 
    fetchPlaylistItems, 
    IPlaylist 
} from "shared/api/playlist";
import { IAlbum } from "shared/api/album";
import { usePlaybackAdapter } from "entities/playback";
import { selectUser } from "entities/user";
import { PlaylistMenu } from "entities/playlist";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IAlbumControlPanel {
    readonly album: IAlbum | null;
}

export const AlbumControlPanel: FC<IAlbumControlPanel> = ({ album }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { adapter } = usePlaybackAdapter();
    const libraryAlbums = useAppSelector(selectSavedAlbums);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const user = useAppSelector(selectUser);
    const { controlPanel, updateControlPanel } = useControlPanel({
        shuffle: false,
        playlistMenu: false,
    } as Record<string, boolean>);

    const setPlaylistMenu = (state: boolean) => updateControlPanel('playlistMenu', state);
    const setShuffle =      (state: boolean) => updateControlPanel("shuffle", state);

    const isAlbumInLibrary = useMemo(
        () => libraryAlbums.findIndex(item => item.album.id === album?.id) !== -1,
        [libraryAlbums, album]
    );

    useEffect(() => {
        if (adapter.getContextURI() === album?.uri) {
            setShuffle(adapter.getShuffle());
        }
    }, [adapter.getContextURI(), album])

    const handlePlay = async () => {
        try {
            if (adapter.getContextURI() === album?.uri) {
                await adapter.resume();
            } else {
                await adapter.play({ context_uri: album?.uri ?? "" });
                adapter.toggleShuffle(controlPanel.shuffle);
            }
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const toggleShuffle = () => {
        setShuffle(!controlPanel.shuffle);

        if (adapter.getContextURI() === album?.uri) {
            adapter.toggleShuffle(!controlPanel.shuffle);
        }
    }

    const saveAlbum = async () => {
        try {
            if (isAlbumInLibrary) {
                await removeAlbumsFromLibrary([album?.id ?? ""]);
                toast.info("The album have been removed from the library.");
            } else {
                await saveAlbumsToLibrary([album?.id ?? ""]);
                toast.info("The album have been added to the library.");
            }
            dispatch(getLibraryAlbums());
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("PLAY", e);
        }
    }

    const addToNewPlaylist = async () => {
        try {
            if (!user || !album) throw new Error("User or album doesn't exist"); 

            const newPlaylist: IPlaylist = await dispatch(createPlaylistThunk({
                userId: user.id,
                body: {
                    name: "New Playlist #" + (libraryPlaylists.length + 1),
                }
            })).unwrap();
    
            if (newPlaylist) {
                const albumTrackURIs = album.tracks.items
                    .map(item => item.uri)
                    .filter(item => item !== undefined);



                await addItemsToPlaylist(newPlaylist.id, [...albumTrackURIs], 0);
    
                navigate(`/playlists/${newPlaylist.id}`);
                setPlaylistMenu(false);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-NEW-PLAYLIST", e);
        }
    }

    const addToPlaylist = async (playlistId: string) => {
        try {
            if (!playlistId || !album) throw new Error("PlaylistID or album doesn't exist");

            const playlistItems = (await fetchPlaylistItems(playlistId)).items.map(({track}) => track);

            const notAddedTrackURIs = album.tracks.items
                .filter(track => playlistItems.findIndex(item => item.id === track.id) === -1)
                .map(track => track.uri)
                .filter(uri => uri !== undefined);
            
            
            if (notAddedTrackURIs.length > 0 && notAddedTrackURIs.length <= 100) {
                await addItemsToPlaylist(playlistId, [...notAddedTrackURIs], 0);
                
                setPlaylistMenu(false);
                toast("The songs from the album have been added to this playlist.");
            } else if (notAddedTrackURIs.length > 100) {
                toast.warn("Cannot handle this operation. Tracks in albums are over 100.");                
            } else {
                toast.warn("All songs from the album is already in this playlist.");                
            }            
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-PLAYLIST", e);
        }
    }

    return (
        <>
            <div className={styles["album-control-panel"]}>
                <div className={styles["control-panel-button-container"]}>
                    <button 
                        className={styles["control-panel-button"]} 
                        onClick={async () => await handlePlay()}
                        >
                        {adapter.getContextURI() === album?.uri && adapter.getIsPlaying() ?
                        <Pause width={60} height={60} /> :
                        <Play width={60} height={60} />}
                    </button>
                    <button 
                        className={clsx(
                            styles["control-panel-button"],
                            controlPanel.shuffle && styles["shuffle"],
                        )} 
                        onClick={toggleShuffle}
                    >
                        <Shuffle width={50} height={50} />
                    </button>
                    <button
                        className={clsx(
                            styles["control-panel-button"],
                            isAlbumInLibrary && styles["active"]
                        )}
                        onClick={async () => await saveAlbum()}
                    >
                        <AddIcon width={50} height={50} className={styles["icon"]} />
                        <CheckFilled width={50} height={50} className={styles["icon__active"]} />
                    </button>
                    <button
                        className={styles["control-panel-button"]}
                        onClick={() => setPlaylistMenu(!controlPanel.playlistMenu)}
                    >
                        <PlaylistMenu 
                            className={styles["playlist-menu"]}
                            isOpen={controlPanel.playlistMenu}
                            setIsOpen={setPlaylistMenu}
                            onCreatePlaylist={addToNewPlaylist}
                            onSelectPlaylist={addToPlaylist}
                        />
                        <AddToPlaylist width={50} height={50} />
                    </button>
                </div>
            </div>
        </>
    )
}