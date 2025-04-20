import { 
    FC, 
    useCallback, 
    useMemo 
} from "react";
import { 
    BottomSheet,
    ContextMenu,
    MenuButton, 
} from "shared/ui";
import { 
    AddToPlaylist, 
    Edit, 
    FolderIcon, 
    RemoveIcon 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector, 
    useControlPanel, 
    useWindowDimensions
} from "shared/lib";
import { 
    createPlaylistThunk, 
    librarySlice, 
    selectFolders, 
    selectSavedPlaylists 
} from "features/library";
import { 
    addItemsToPlaylist, 
    fetchPlaylistItems, 
    IPlaylist 
} from "shared/api/playlist";
import { PlaylistMenu } from "entities/playlist";
import { DeleteMenu } from "../DeleteMenu/DeleteMenu";
import { EditMenu } from "../EditMenu/EditMenu";
import { useNavigate } from "react-router";
import { selectUser } from "entities/user";
import { FolderMenu } from "entities/folder";
import { toast } from "react-toastify";
import styles from "./style.module.scss";


interface IMoreMenu {
    readonly isOpen: boolean;
    readonly setIsOpen: (state: boolean) => void;
    readonly playlist: IPlaylist | null;
}

export const MoreMenu: FC<IMoreMenu> = ({ isOpen, setIsOpen, playlist }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const folders = useAppSelector(selectFolders);
    const user = useAppSelector(selectUser);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const { addToFolder, removeFromFolder, createFolder } = librarySlice.actions;
    const { width } = useWindowDimensions();
    const { controlPanel, updateControlPanel } = useControlPanel({
        playlistMenu: false,
        folderMenu:   false,
        deleteMenu:   false,
        editMenu:     false,
    } as Record<string, boolean>);

    const setPlaylistMenu = (state: boolean) => updateControlPanel('playlistMenu', state);
    const setFolderMenu =   (state: boolean) => updateControlPanel('folderMenu', state);
    const setDeleteMenu =   (state: boolean) => updateControlPanel('deleteMenu', state);
    const setEditMenu =     (state: boolean) => updateControlPanel('editMenu', state);

    const findFolderIdByPlaylist = useCallback(() => {
        const folder = folders.find(folder => 
            folder.items.some(item => item.id === playlist?.id)
        );

        return folder?.id || null;
    }, [folders, playlist]);

    const isUserOwner = useMemo(
        () => playlist?.owner.id === user?.id,
        [user, playlist]
    )

    const addToNewPlaylist = async () => {
        try {
            if (!user || !playlist) throw new Error("User or playlist doesn't exist");

            const newPlaylist: IPlaylist = await dispatch(createPlaylistThunk({
                userId: user.id,
                body: {
                    name: "New Playlist #" + (libraryPlaylists.length + 1),
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
        try {
            if (!playlistId || !playlist) throw new Error("Playlist doesn't exist");

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
    
    const removeFromFolderHandle = () => {
        if (!playlist) return;
        if (findFolderIdByPlaylist() !== null) {
            dispatch(removeFromFolder({
                id: findFolderIdByPlaylist() ?? "", 
                itemId: playlist.id ?? ""
            }));
            toast("The playlist has been removed.");
        }
    } 

    const addToNewFolder = () => {
        if (!playlist) return;
        removeFromFolderHandle();

        const newFolderId = dispatch(createFolder("Folder #" + (folders.length + 1))).payload;
        dispatch(addToFolder({
            id: newFolderId, 
            item: playlist
        }));
        navigate(`/folders/${newFolderId}`);
    }
    
    const addToFolderHandle = (folderID: string) => {
        if (!playlist) return;
        removeFromFolderHandle();        

        dispatch(addToFolder({
            id: folderID,
            item: playlist
        }))

        toast.info("The playlist has been moved to this folder.")
    }

    return (
        <>
            {width >= 768
            ?
            <ContextMenu 
                className={styles["more-menu"]}
                isMenuOpen={isOpen}
                setIsMenuOpen={() => {
                    setIsOpen(false);
                    setPlaylistMenu(false);
                    setFolderMenu(false);
                }}
                hideMainContent={(controlPanel.playlistMenu || controlPanel.folderMenu)}
                hasNested
                additionalElements={
                    <>
                        <PlaylistMenu 
                            isOpen={controlPanel.playlistMenu}
                            setIsOpen={setPlaylistMenu}
                            onSelectPlaylist={addToPlaylist}
                            onCreatePlaylist={addToNewPlaylist}
                            isNested
                        />
                        <FolderMenu 
                            isOpen={controlPanel.folderMenu}
                            setIsOpen={setFolderMenu}
                            onCreateFolder={addToNewFolder}
                            onSelectFolder={addToFolderHandle}
                            onRemoveFromFolder={removeFromFolderHandle}
                            folderId={findFolderIdByPlaylist() ?? null}
                            isNested
                        />
                    </>
                }
            >
                <MenuButton 
                    Icon={AddToPlaylist}
                    text="Add to playlist"
                    onClick={() => setPlaylistMenu(true)}
                    hasNestedMenu
                />
                <MenuButton 
                    Icon={FolderIcon}
                    text="Add to folder"
                    onClick={() => setFolderMenu(true)}
                    hasNestedMenu
                />
                {isUserOwner && 
                    <>
                        <MenuButton 
                            Icon={Edit}
                            text="Edit details"
                            onClick={() => setEditMenu(true)}
                        />,
                        <MenuButton 
                            Icon={RemoveIcon}
                            text="Delete"
                            onClick={() => setDeleteMenu(true)}
                        />
                    </>
                }
            </ContextMenu>
            :
            <BottomSheet
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <MenuButton 
                    Icon={AddToPlaylist}
                    text="Add to playlist"
                    onClick={() => setPlaylistMenu(true)}
                />
                <MenuButton 
                    Icon={FolderIcon}
                    text="Add to folder"
                    onClick={() => setFolderMenu(true)}
                />
                {isUserOwner
                ?
                <>
                    <MenuButton 
                        Icon={Edit}
                        text="Edit details"
                        onClick={() => setEditMenu(true)}
                    />
                    <MenuButton 
                        Icon={RemoveIcon}
                        text="Delete"
                        onClick={() => setDeleteMenu(true)}
                    />
                </>
                : null}
                <PlaylistMenu 
                    isOpen={controlPanel.playlistMenu}
                    setIsOpen={setPlaylistMenu}
                    onCreatePlaylist={addToNewPlaylist}
                    onSelectPlaylist={addToPlaylist}
                    playlistId={playlist?.id}
                />
                <FolderMenu 
                    isOpen={controlPanel.folderMenu}
                    setIsOpen={setFolderMenu}
                    onCreateFolder={addToNewFolder}
                    onSelectFolder={addToFolderHandle}
                    onRemoveFromFolder={removeFromFolderHandle}
                    folderId={findFolderIdByPlaylist() ?? null}
                />
            </BottomSheet>}
            <DeleteMenu 
                id={playlist?.id ?? ""}
                isOpen={controlPanel.deleteMenu}
                setIsOpen={setDeleteMenu}
                onDelete={removeFromFolderHandle}
            />
            <EditMenu 
                playlist={playlist}
                isOpen={controlPanel.editMenu}
                setIsOpen={setEditMenu}
            /> 
        </>
    );
}