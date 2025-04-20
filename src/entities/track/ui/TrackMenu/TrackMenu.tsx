import { FC, useCallback, useEffect } from "react";
import { 
    BottomSheet,
    ContextMenu,
    MenuButton, 
} from "shared/ui";
import { 
    AddIcon, 
    AddToPlaylist, 
    AddToQueue, 
    Album, 
    ArtistIcon, 
    CheckFilled, 
    Like, 
    LikeFilled, 
    RemoveIcon, 
} from "shared/assets";
import { 
    useNavigate 
} from "react-router";
import { 
    useAppDispatch, 
    useAppSelector, 
    useControlPanel, 
    useWindowDimensions
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
    getLikedTracks, 
    selectSavedPlaylists 
} from "features/library";
import { selectUser } from "entities/user";
import { toast } from "react-toastify";
import { checkLikedTracks, removeTracksFromLibrary, saveTracksToLibrary } from "shared/api/user";
import { PlaylistMenu } from "entities/playlist";
import styles from "./style.module.scss";
import { ArtistMenu } from "entities/artist";


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
    const { width } = useWindowDimensions();
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

    const saveTrack = async () => {
        try {
            if (controlPanel.isTrackLiked) {
                await removeTracksFromLibrary([id ?? ""]);
                toast.info("The track have been removed from the library.");
            } else {
                await saveTracksToLibrary([id ?? ""]);
                toast.info("The track have been added to the library.");
            }
            dispatch(getLikedTracks());
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("PLAY", e);
        }
    }

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
                    name: "New Playlist #" + (libraryPlaylists.length + 1),
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

    return (
        width >= 768
        ?
        <ContextMenu
            className={styles["track-menu"]}
            isMenuOpen={isOpen}
            setIsMenuOpen={setIsOpen}
            hideMainContent={(controlPanel.playlistMenu || controlPanel.artistMenu)}
            hasNested
            additionalElements={[
                <PlaylistMenu 
                    key={"track-playlist"}
                    isOpen={controlPanel.playlistMenu}
                    setIsOpen={setPlaylistMenu}
                    onSelectPlaylist={addToPlaylist}
                    onCreatePlaylist={addToNewPlaylist}
                    isNested
                />,
                <ArtistMenu 
                    key={"track-artist"}
                    artists={artists}
                    isOpen={controlPanel.artistMenu}
                    setIsOpen={() => {
                        setArtistMenu(false);
                        setPlaylistMenu(false);
                    }}
                />
            ]}
        >
            <MenuButton 
                Icon={AddToPlaylist}
                text="Add to playlist"
                hasNestedMenu
                onClick={() => {
                    setPlaylistMenu(true)
                    setArtistMenu(false);
                }}
            />
            {playlistId &&
            <MenuButton 
                Icon={RemoveIcon}
                text="Remove from this playlist"
                onClick={async () => removeFromPlaylist()}
            />}
            <MenuButton 
                Icon={AddToQueue}
                text="Add to queue"
                onClick={async () => await addItemToQueueHandle()}
            />
            {album?.id &&
            <MenuButton 
                Icon={Album}
                text="Go to album"
                buttonType="link-button"
                to={`/albums/${album.id}`}
                onClick={() => setIsOpen(false)}
            />}
            {(track.artists?.length ?? 0) > 1 
            ?
                <MenuButton 
                    Icon={ArtistIcon}
                    text="Go to artist"
                    hasNestedMenu
                    onClick={() => {
                        setArtistMenu(true);
                        setPlaylistMenu(false);
                    }}
                />
            :
                <MenuButton 
                    Icon={ArtistIcon}
                    text="Go to artist"
                    buttonType="link-button"
                    to={`/artists/${track.artists?.[0]?.id ?? ""}`}
                    onClick={() => setIsOpen(false)}                        
                />
            }
            <MenuButton 
                Icon={controlPanel.isTrackLiked ?
                    LikeFilled :
                    Like
                }
                text={controlPanel.isTrackLiked ?
                    "Remove from library" :
                    "Save to library"
                }
                onClick={async () => await saveTrack()}
            />
        </ContextMenu>
        :
        <div className={styles["menu-wrapper"]} onClick={e => e.stopPropagation()}>
            <BottomSheet
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <MenuButton 
                    Icon={AddToPlaylist}
                    text={"Add to playlist"}
                    onClick={() => setPlaylistMenu(true)}
                />
                {playlistId &&
                <MenuButton
                    Icon={RemoveIcon}
                    text={"Remove from this playlist"}
                    onClick={async () => await removeFromPlaylist()}
                />}
                <MenuButton
                    Icon={controlPanel.isTrackLiked ?
                        CheckFilled :
                        AddIcon
                    }
                    text={controlPanel.isTrackLiked ?
                        "Remove from your Liked Songs" :
                        "Save to your Liked Songs"
                    }
                    onClick={async () => await saveTrack()}
                />
                <MenuButton
                    Icon={AddToQueue}
                    text={"Add to queue"}
                    onClick={async () => await addItemToQueueHandle()}
                />
                {album?.id &&
                <MenuButton
                    Icon={Album}
                    text={"Go to album"}
                    buttonType={"link-button"}
                    to={`/albums/${album.id}`}
                />}
                {artists.length > 1 
                ?
                    <MenuButton
                        Icon={ArtistIcon}
                        text={"Go to artist"}
                        onClick={() => setArtistMenu(true)}
                    />
                : artists?.[0]?.id ?
                    <MenuButton
                        Icon={ArtistIcon}
                        text="Go to artist"
                        buttonType="link-button"
                        to={`/artists/${artists?.[0].id}`}
                    />
                : null}
            </BottomSheet>
            <ArtistMenu 
                isOpen={controlPanel.artistMenu}
                setIsOpen={setArtistMenu}
                artists={artists}
            />
            <PlaylistMenu 
                isOpen={controlPanel.playlistMenu}
                setIsOpen={setPlaylistMenu}
                onCreatePlaylist={addToNewPlaylist}
                onSelectPlaylist={addToPlaylist}
            />
        </div>
    )
}