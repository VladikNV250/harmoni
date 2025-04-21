import { FC } from "react";
import { useNavigate } from "react-router";
import {
    createPlaylistThunk,
    librarySlice,
    selectSavedPlaylists
} from "features/library";
import { PlaylistMenu } from "features/menus";
import { IFolder } from "entities/folder";
import { selectUser } from "entities/user";
import {
    Edit,
    LeftIcon,
    PlaylistIcon,
    RemoveIcon
} from "shared/assets";
import {
    useAppDispatch,
    useAppSelector,
    useControlPanel
} from "shared/lib";
import { Title } from "shared/ui";
import { IPlaylist } from "shared/api/playlist";
import { DeleteMenu } from "../DeleteMenu/DeleteMenu";
import { EditMenu } from "../EditMenu/EditMenu";
import { toast } from "react-toastify";
import styles from "./style.module.scss";


interface IFolderControlPanel {
    /** Folder to which the control panel is applied. */
    readonly folder: IFolder | null
}

/**
 * @component FolderControlPanel
 * @description Control panel for a folder. Allows you to rename, delete, or add playlists to the folder  
 */
export const FolderControlPanel: FC<IFolderControlPanel> = ({ folder }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const { addToFolder } = librarySlice.actions;
    const { controlPanel, updateControlPanel } = useControlPanel({
        editMenu: false,
        deleteMenu: false,
        playlistMenu: false
    } as Record<string, boolean>)

    const setEditMenu = (state: boolean) => updateControlPanel("editMenu", state);
    const setDeleteMenu = (state: boolean) => updateControlPanel("deleteMenu", state);
    const setPlaylistMenu = (state: boolean) => updateControlPanel("playlistMenu", state);

    const addNewPlaylist = async () => {
        try {
            if (!user || !folder) throw new Error("User or folder doesn't exist");

            const newPlaylist: IPlaylist = await dispatch(createPlaylistThunk({
                userId: user.id,
                body: {
                    name: "New Playlist #" + libraryPlaylists.length,
                }
            })).unwrap();

            if (newPlaylist) {
                dispatch(addToFolder({ id: folder.id, item: newPlaylist }));
                setPlaylistMenu(false);
            }
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-TO-NEW-PLAYLIST", e);
        }
    }

    const addPlaylist = (playlistId: string) => {
        if (!folder || !playlistId) {
            toast.error("Something went wrong. Try again or reload the page.");
        } else {
            const playlist = libraryPlaylists.find(item => item.id === playlistId);

            if (playlist) {
                const isPlaylistInFolder = folder.items.findIndex(item => item.id === playlist.id) !== -1;

                if (isPlaylistInFolder) {
                    toast.warn("Playlist is already in folder.");
                } else {
                    dispatch(addToFolder({ id: folder.id, item: playlist }));
                }
            } else {
                toast.error("Something went wrong. Try again or reload the page.");
            }
        }
    }

    return (
        <>
            <EditMenu
                id={folder?.id ?? ""}
                name={folder?.name ?? ""}
                isOpen={controlPanel.editMenu}
                setIsOpen={setEditMenu}
            />
            <DeleteMenu
                id={folder?.id ?? ""}
                isOpen={controlPanel.deleteMenu}
                setIsOpen={setDeleteMenu}
            />
            <header className={styles["folder-header"]}>
                <button
                    className={styles["folder-button"]}
                    onClick={() => navigate(-1)}
                >
                    <LeftIcon width={40} height={40} />
                </button>
                <Title className={styles["folder-name"]}>
                    {folder?.name ?? ""}
                </Title>
                <button
                    className={styles["folder-button"]}
                    onClick={() => setDeleteMenu(true)}
                >
                    <RemoveIcon width={40} height={40} />
                </button>
                <button
                    className={styles["folder-button"]}
                    onClick={() => setEditMenu(true)}
                >
                    <Edit width={40} height={40} />
                </button>
                <button
                    className={styles["folder-button"]}
                    onClick={() => setPlaylistMenu(!controlPanel.playlistMenu)}
                >
                    <PlaylistMenu
                        isOpen={controlPanel.playlistMenu}
                        setIsOpen={setPlaylistMenu}
                        onCreatePlaylist={addNewPlaylist}
                        onSelectPlaylist={addPlaylist}
                        className={styles["folder-playlist-menu"]}
                    />
                    <PlaylistIcon width={40} height={40} />
                </button>
            </header>
        </>
    )
}