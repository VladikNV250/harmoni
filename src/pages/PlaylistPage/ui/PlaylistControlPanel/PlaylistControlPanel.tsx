import { 
    FC, 
    useCallback, 
    useMemo 
} from "react";
import { 
    addItemsToPlaylist, 
    fetchPlaylistItems, 
    followPlaylist, 
    IPlaylist, 
    unfollowPlaylist 
} from "shared/api/playlist";
import { 
    Description, 
    DragDownMenu, 
    FilledButton, 
    OutlinedButton, 
    Paragraph 
} from "shared/ui";
import { 
    AddIcon, 
    AddToPlaylist, 
    CheckFilled, 
    Edit, 
    FolderIcon, 
    More, 
    Pause, 
    Play, 
    RemoveIcon, 
    Shuffle 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector, 
    useControlPanel 
} from "shared/lib";
import { 
    createPlaylistThunk, 
    getLibraryPlaylists, 
    librarySlice, 
    selectFolders, 
    selectSavedPlaylists 
} from "features/library";
import { DeleteMenu } from "../DeleteMenu/DeleteMenu";
import { EditMenu } from "../EditMenu/EditMenu";
import { selectUser } from "entities/user";
import { useNavigate } from "react-router";
import { usePlaybackAdapter } from "entities/playback";
import { AddToPlaylistMenu } from "entities/playlist";
import { IFolder } from "entities/folder";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IPlaylistControlPanel {
    readonly playlist: IPlaylist | null,
}

export const PlaylistControlPanel: FC<IPlaylistControlPanel> = ({ playlist }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const folders = useAppSelector(selectFolders);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const { adapter } = usePlaybackAdapter();
    const { addToFolder, removeFromFolder, createFolder } = librarySlice.actions;
    const { controlPanel, updateControlPanel } = useControlPanel({
        shuffle:      false,
        moreMenu:     false,
        playlistMenu: false,
        folderMenu:   false,
        deleteMenu:   false,
        editMenu:     false,
    } as Record<string, boolean>);

    const setMoreMenu =     (state: boolean) => updateControlPanel('moreMenu', state);
    const setPlaylistMenu = (state: boolean) => updateControlPanel('playlistMenu', state);
    const setFolderMenu =   (state: boolean) => updateControlPanel('folderMenu', state);
    const setShuffle =      (state: boolean) => updateControlPanel('shuffle', state);
    const setDeleteMenu =   (state: boolean) => updateControlPanel('deleteMenu', state);
    const setEditMenu =     (state: boolean) => updateControlPanel('editMenu', state);

    const isPlaylistInLibrary = useMemo(
        () => libraryPlaylists.findIndex(item => item.id === playlist?.id) !== -1,
        [libraryPlaylists, playlist]
    )

    const isUserOwner = useMemo(
        () => playlist?.owner.id === user?.id,
        [user, playlist]
    )

    const findFolderIdByPlaylist = useCallback(() => {
        const folder = folders.find(folder => 
            folder.items.some(item => item.id === playlist?.id)
        );

        return folder?.id || null;
    }, [folders, playlist]);

    const handlePlay = async () => {
        try {
            await adapter.play({ context_uri: playlist?.uri ?? "" });
            adapter.toggleShuffle(controlPanel.shuffle);
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const toggleShuffle = () => {
        setShuffle(!controlPanel.shuffle);

        if (adapter.getContextURI() === playlist?.uri) {
            adapter.toggleShuffle(!controlPanel.shuffle);
        }
    }

    const savePlaylist = async () => {
        try {
            if (isPlaylistInLibrary) {
                await unfollowPlaylist(playlist?.id ?? "");
                toast.info("The playlist has been removed from the library.");
            } else {
                await followPlaylist(playlist?.id ?? "");
                toast.info("The playlist has been added to the library.");
            }
            dispatch(getLibraryPlaylists());
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("SAVE", e);
        }
    }

    const addToNewPlaylist = async () => {
        if (!user || !playlist) {
            toast.error("Something went wrong. Try again or reload the page.")
            return;
        } 

        try {
            const newPlaylist: IPlaylist = await dispatch(createPlaylistThunk({
                userId: user.id,
                body: {
                    name: "New Playlist #" + libraryPlaylists.length,
                }
            })).unwrap();

            if (newPlaylist) {
                const playlistTrackURIs = playlist.tracks.items
                    .map(({ track }) => track.uri)
                    .filter(item => item !== undefined);



                await addItemsToPlaylist(newPlaylist.id, [...playlistTrackURIs], 0);

                navigate(`/playlists/${newPlaylist.id}`);
                setPlaylistMenu(false);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-NEW-PLAYLIST", e);
        }
    }

    const addToPlaylist = async (playlistId: string) => {
        if (!playlistId || !playlist) {
            toast.error("Something went wrong. Try again or reload the page.");
            return;
        }

        try {
            const playlistItems = (await fetchPlaylistItems(playlistId)).items.map(({track}) => track);

            const notAddedTrackURIs = playlist.tracks.items
                .filter(({ track }) => playlistItems.findIndex(item => item.id === track.id) === -1)
                .map(({ track }) => track.uri)
                .filter(uri => uri !== undefined);
            
            
            if (notAddedTrackURIs.length > 0 && notAddedTrackURIs.length <= 100) {
                await addItemsToPlaylist(playlistId, [...notAddedTrackURIs], 0);
                
                setPlaylistMenu(false);
                toast("The songs from the playlist have been added to this playlist.");
            } else if (notAddedTrackURIs.length > 100) {
                toast.warn("Cannot handle this operation. Tracks in playlist are over 100.");                
            } else {
                toast.warn("All songs from the playlist is already in this playlist.");                
            }            
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-PLAYLIST", e);
        }
    }

    const addToNewFolder = () => {
        if (!playlist) return;

        const newFolderId = dispatch(createFolder("Folder #" + folders.length + 1)).payload;
        dispatch(addToFolder({
            id: newFolderId, 
            item: playlist
        }));
        navigate(`/folders/${newFolderId}`);
    }

    const removeFromFolderHandle = () => {
        if (!playlist) return;

        dispatch(removeFromFolder({
            id: findFolderIdByPlaylist() ?? "", 
            itemId: playlist.id ?? ""
        }));
    } 
    
    const addToFolderHandle = (folderID: string) => {
        if (!playlist) return;
        if (findFolderIdByPlaylist() !== null) {
            removeFromFolderHandle();
        }

        dispatch(addToFolder({
            id: folderID,
            item: playlist
        }))

        toast.info("The playlist has been moved to this folder.")
    }

    const renderFolders = (items: IFolder[]) => {
        return items.map(folder => {
            if (folder.id !== findFolderIdByPlaylist()) return (
                <button 
                    key={folder.id} 
                    className={styles["menu-folders-button"]}
                    onClick={() => addToFolderHandle(folder.id)}
                >
                    <FolderIcon width={40} height={40} />                
                    <Description>
                        {folder.name ?? ""}
                    </Description>
                </button>
            )
        });
    }

    return (
        <>
            <DragDownMenu
                isOpen={controlPanel.moreMenu} 
                setIsOpen={setMoreMenu}>
                <div className={styles["menu-content"]}>
                    <button 
                        className={styles["menu-button"]}
                        onClick={() => setPlaylistMenu(true)}    
                    >
                        <AddToPlaylist width={40} height={40} />
                        <Paragraph>Add to playlist</Paragraph>
                    </button>
                    <button 
                        className={styles["menu-button"]}
                        onClick={() => setFolderMenu(true)}    
                    >
                        <FolderIcon width={40} height={40} />
                        <Paragraph>Add to folder</Paragraph>
                    </button>
                    {isUserOwner
                    ?
                    <>
                        <button 
                            className={styles["menu-button"]}
                            onClick={() => setEditMenu(true)}    
                        >
                            <Edit width={40} height={40} />
                            <Paragraph>Edit details</Paragraph>
                        </button>
                        <button 
                            className={styles["menu-button"]}
                            onClick={() => setDeleteMenu(true)}    
                        >
                            <RemoveIcon width={40} height={40} />
                            <Paragraph>Delete</Paragraph>
                        </button>
                    </>
                    : null}
                </div>
            </DragDownMenu>
            <AddToPlaylistMenu 
                isOpen={controlPanel.playlistMenu}
                setIsOpen={setPlaylistMenu}
                addToNewPlaylist={addToNewPlaylist}
                addToPlaylist={addToPlaylist}
                playlistId={playlist?.id}
            />
            <DragDownMenu
                className={styles["menu-folders"]}
                isOpen={controlPanel.folderMenu}
                setIsOpen={setFolderMenu}
            >
                <div className={styles["menu-folders-body"]}>
                    <FilledButton onClick={addToNewFolder}>
                        <Paragraph>
                            Add to new folder
                        </Paragraph>
                    </FilledButton>     
                    {findFolderIdByPlaylist() !== null &&
                    <OutlinedButton onClick={removeFromFolderHandle}>
                        <Paragraph>
                            Remove from folders
                        </Paragraph>
                    </OutlinedButton>}
                    <div className={styles["menu-folders-content"]}>
                        {renderFolders(folders)}
                    </div>
                </div>
            </DragDownMenu>
            <DeleteMenu 
                id={playlist?.id ?? ""}
                isOpen={controlPanel.deleteMenu}
                setIsOpen={setDeleteMenu}
            />
            <EditMenu 
                playlist={playlist}
                isOpen={controlPanel.editMenu}
                setIsOpen={setEditMenu}
            />  
            <div className={styles["playlist-control-panel"]}>
                <div className={styles["control-panel-button-container"]}>
                    <button 
                        className={styles["control-panel-button"]} 
                        onClick={async () => await handlePlay()}
                        >
                        {adapter.getContextURI() === playlist?.uri ?
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
                    {!isUserOwner 
                    &&
                    <button
                        className={clsx(
                            styles["control-panel-button"],
                            isPlaylistInLibrary && styles["active"]
                        )}
                        onClick={async () => await savePlaylist()}
                    >
                        <AddIcon width={50} height={50} className={styles["icon"]} />
                        <CheckFilled width={50} height={50} className={styles["icon__active"]} />
                    </button>}
                    <button
                        className={styles["control-panel-button"]}
                        onClick={() => setMoreMenu(true)}
                    >
                        <More width={50} height={50} />
                    </button>
                </div>
            </div>
        </>
    )
}