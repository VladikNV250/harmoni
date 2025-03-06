import { FC, useEffect, useState } from "react";
import { 
    Edit, 
    GridIcon, 
    LeftIcon, 
    ListIcon, 
    PlaylistIcon, 
    RemoveIcon, 
    Sort 
} from "shared/assets";
import { Description, Loader, Title } from "shared/ui";
import { 
    createPlaylistThunk, 
    getLibraryPlaylists, 
    ListPreview, 
    selectFolders, 
    selectLibraryLoading, 
    selectSavedPlaylists, 
    useView 
} from "features/library";
import { useNavigate, useParams } from "react-router";
import { IFolder } from "entities/folder";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { IPlaylist } from "shared/api/playlist";
import { PlaylistPreview } from "entities/playlist";
import { EditMenu } from "../EditMenu/EditMenu";
import styles from "./style.module.scss";
import { getUserInfo, selectUser, selectUserLoading } from "entities/user";
import { DeleteMenu } from "../DeleteMenu/DeleteMenu";

const FolderPage: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [folder, setFolder] = useState<IFolder | null>(null);
    const [isOpen, setIsOpen] = useState({
        editMenu: false,
        deleteMenu: false,
    });
    const folders = useAppSelector(selectFolders);
    const user = useAppSelector(selectUser);
    const playlists = useAppSelector(selectSavedPlaylists);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const userLoading = useAppSelector(selectUserLoading);
    const { viewMode, switchMode } = useView();

    useEffect(() => {
        const findedFolder = folders.find(item => item.id === id);

        if (findedFolder) {
            setFolder(findedFolder);
        } else {
            setFolder(null);
        }
    }, [id, folders]);

    useEffect(() => {
        dispatch(getUserInfo());
        dispatch(getLibraryPlaylists());
    }, [dispatch])

    const renderItems = (items: IPlaylist[]) => {
        switch (viewMode) {
            case "list":
                return (
                    <div className={styles["folder-list"]}>
                        {items.map(item => 
                            <ListPreview key={item.id} item={item} />
                        )}
                    </div>
                )
            case "grid":
                return (
                    <div className={styles["folder-grid"]}>
                        {items.map(item => 
                            <PlaylistPreview key={item.id} playlist={item} />
                        )}
                    </div>
                )
        }
    }

    const handleCreatePlaylist = async () => {
        if (user) {
            const playlist = (await dispatch(createPlaylistThunk({
                userId: user.id, 
                body: {
                    name: `Playlist#${playlists.length + 1}`,
                    collaborative: false,
                    description: "",
                    public: true,
                }
            }))).unwrap();

            navigate(`/playlists/${playlist.id}`)
        }
    }

    return (
        <div className={styles["folder"]}>
            <Loader loading={userLoading || libraryLoading} />
            <EditMenu 
                id={folder?.id ?? ""}
                name={folder?.name ?? ""}
                isOpen={isOpen.editMenu}
                setIsOpen={(isOpen) => setIsOpen(prevState => ({...prevState, editMenu: isOpen}))}
            />
            <DeleteMenu 
                id={folder?.id ?? ""}
                isOpen={isOpen.deleteMenu}
                setIsOpen={(isOpen) => setIsOpen(prevState => ({...prevState, deleteMenu: isOpen}))}
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
                    onClick={() => setIsOpen(prevState => ({...prevState, deleteMenu: true}))}
                >
                    <RemoveIcon width={40} height={40} />
                </button>
                <button 
                    className={styles["folder-button"]} 
                    onClick={() => setIsOpen(prevState => ({...prevState, editMenu: true}))}
                >
                    <Edit width={40} height={40} />
                </button>
                <button 
                    className={styles["folder-button"]}
                    onClick={async () => await handleCreatePlaylist()}
                >
                    <PlaylistIcon width={40} height={40} />
                </button>
            </header>
            <div className={styles["folder-body"]}>
                <header className={styles['folder-body-header']}>
                    <button className={styles['folder-body-button']}>
                        <Sort width={40} height={40} />
                        <Description>
                            Recents
                        </Description>
                    </button>
                    <button 
                        className={styles['folder-body-button']} 
                        onClick={switchMode}
                    >
                        <Description>
                            {viewMode === "list" 
                            ? "List" 
                            : "Grid"}
                        </Description>
                        {viewMode === "list" 
                        ? <ListIcon width={40} height={40} />
                        : <GridIcon width={40} height={40} />}
                    </button>
                </header>
                {(folder?.items.length ?? 0) === 0 
                ?
                <Title className={styles["folder-empty"]}>
                    This folder looks empty
                </Title>
                :
                renderItems(folder?.items ?? [])
                }
            </div>
        </div>
    )
}

export default FolderPage