import { 
    FC, 
    MouseEvent 
} from "react";
import { 
    Link, 
    useNavigate 
} from "react-router";
import { 
    AddToPlaylist, 
    AddToQueue, 
    Album, 
    ArtistIcon, 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    DragDownMenu, 
    Paragraph, 
} from "shared/ui";
import { 
    addItemToQueue, 
    getUserQueue 
} from "features/queue";
import { 
    createPlaylistThunk, 
    selectSavedPlaylists 
} from "features/library";
import { 
    addItemsToPlaylist, 
    fetchPlaylistItems, 
    IPlaylist 
} from "shared/api/playlist";
import { usePlaybackAdapter } from "entities/playback";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { selectUser } from "entities/user";
import { toast } from "react-toastify";
import { PlaylistMenu } from "entities/playlist";
import styles from "./style.module.scss";


interface IMoreMenu {
    readonly menus: Record<string, boolean>,
    readonly openMenu: (whatOpen: string, openState?: boolean) => void,
}

export const MoreMenu: FC<IMoreMenu> = ({ menus, openMenu }) => {
    const dispatch = useAppDispatch();    
    const navigate = useNavigate();
    const { adapter } = usePlaybackAdapter();
    const { toggleFullscreenMode } = playerSlice.actions;
    const playlists = useAppSelector(selectSavedPlaylists);
    const user = useAppSelector(selectUser);
    
    const addItemToQueueHandle = async (uri: string) => {
        if (uri === "") return;

        try {
            await addItemToQueue(uri);
            await dispatch(getUserQueue());
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-ITEM-TO-QUEUE", e);
        }
    }

    const openArtistMenu = (e: MouseEvent) => {
        e.stopPropagation();
        openMenu("artistMenu", true);
    }

    const openPlaylistMenu = (e: MouseEvent) => {
        e.stopPropagation();
        openMenu("playlistMenu", true);
    }

    const addToNewPlaylist = async () => {
        try {
            const trackUri = adapter.getTrackURI();
            if (!user || !trackUri) throw new Error("User or trackURI doesn't exist"); 
            
            const newPlaylist: IPlaylist = await dispatch(createPlaylistThunk({
                userId: user.id,
                body: {
                    name: "New Playlist #" + playlists.length,
                }
            })).unwrap();
    
            if (newPlaylist) {
                await addItemsToPlaylist(newPlaylist.id, [trackUri], 0);
    
                navigate(`/playlists/${newPlaylist.id}`);
                openMenu("moreMenu", false);
                openMenu("playlistMenu", false);
                dispatch(toggleFullscreenMode());
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-NEW-PLAYLIST", e);
        }
    }

    const addToPlaylist = async (playlistId: string) => {
        try {
            const trackUri = adapter.getTrackURI();
            const trackId = adapter.getTrackID();
            if (!playlistId || !trackId || !trackUri) throw new Error("PlaylistID or trackID or trackURI doesn't exist");

            const playlistItems = (await fetchPlaylistItems(playlistId)).items.map(({track}) => track);

            if (playlistItems.findIndex(item => item.id === trackId) === -1) {
                await addItemsToPlaylist(playlistId, [trackUri], 0);
    
                openMenu("moreMenu", false);
                toast("The song added to this playlist.");
            } else {
                toast.warn("The song have been in this playlist already.");                
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-PLAYLIST", e);
        }
    }

    const renderArtists = (artists: {name: string, id: string}[]) => {
        return artists.map(artist => 
            <Link 
                key={artist.id} 
                to={`/artists/${artist.id}`}
                className={styles["menu-link"]}
                onClick={() => {
                    openMenu("moreMenu", false)
                    dispatch(toggleFullscreenMode())
                }}>
                <ArtistIcon width={40} height={40} />
                {artist.name}
            </Link>
        )
    }

    return (
        <>
            <DragDownMenu isOpen={menus.moreMenu} setIsOpen={(state: boolean) => openMenu("moreMenu", state)}>
                <div className={styles["menu-content"]}>
                    <button 
                        className={styles["menu-button"]}
                        onClick={openPlaylistMenu}    
                    >
                        <AddToPlaylist width={40} height={40} />
                        <Paragraph>Add to playlist</Paragraph>
                    </button>
                    <button 
                        className={styles["menu-button"]} 
                        onClick={async () => await addItemToQueueHandle(adapter.getTrackURI())}
                    >
                        <AddToQueue width={40} height={40} />
                        <Paragraph>Add to queue</Paragraph>
                    </button>
                    <Link 
                        to={adapter.getAlbumLink()} 
                        className={styles["menu-link"]}
                        onClick={() => dispatch(toggleFullscreenMode())}
                    >
                        <Album width={40} height={40} />
                        <Paragraph>Go to album</Paragraph>
                    </Link>
                    {adapter.getArtists().length > 1 
                    ?
                        <button 
                            className={styles["menu-button"]}
                            onClick={openArtistMenu}
                        >
                            <ArtistIcon width={40} height={40} />
                            <Paragraph>Go to artist</Paragraph>
                        </button>
                    :
                        <Link 
                            to={`/artists/${adapter.getArtists()?.[0]?.id}`}
                            className={styles["menu-link"]}
                            onClick={() => dispatch(toggleFullscreenMode())}
                        >
                            <ArtistIcon width={40} height={40} />
                            <Paragraph>Go to artist</Paragraph>
                        </Link>
                    }
                </div>
            </DragDownMenu>
            <DragDownMenu 
                className={styles["menu-artists"]} 
                isOpen={menus.artistMenu} 
                setIsOpen={(state: boolean) => openMenu("artistMenu", state)}
            >
                <div className={styles["menu-artists-content"]}>
                    {renderArtists(adapter.getArtists())}
                </div>
            </DragDownMenu>
            <PlaylistMenu 
                isOpen={menus.playlistMenu}
                setIsOpen={(state: boolean) => openMenu("playlistMenu", state)}
                onCreatePlaylist={addToNewPlaylist}
                onSelectPlaylist={addToPlaylist}
            />
        </>
    )
}