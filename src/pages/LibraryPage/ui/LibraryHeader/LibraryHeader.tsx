import { 
    ChangeEvent, 
    FC, 
    useCallback 
} from "react";
import { 
    Description, 
    SearchInput 
} from "shared/ui";
import { 
    FolderIcon, 
    GridIcon, 
    ListIcon, 
    PlaylistIcon 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    createPlaylistThunk, 
    librarySlice, 
    selectFolders, 
    selectSavedPlaylists 
} from "features/library";
import { selectUser } from "entities/user";
import { shallowEqual } from "react-redux";
import { useNavigate } from "react-router";
import styles from "./style.module.scss";

interface ILibraryHeader {
    readonly value: string;
    readonly setValue: (value: string) => void;
    readonly switchMode: () => void;
    readonly viewMode: "list" | "grid";

}

export const LibraryHeader: FC<ILibraryHeader> = ({ value, setValue, viewMode, switchMode }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const playlists = useAppSelector(selectSavedPlaylists, shallowEqual);
    const folders = useAppSelector(selectFolders, shallowEqual);
    const user = useAppSelector(selectUser);
    const { createFolder } = librarySlice.actions;


    const handleCreateFolder = useCallback(() => {
        const { payload: newFolderId } = dispatch(createFolder("Folder" + (folders.length + 1)));

        navigate(`/folders/${newFolderId}`);
    }, [createFolder, dispatch, folders.length, navigate])

    const handleCreatePlaylist = useCallback(async () => {
        if (!user) return;
            
        const playlist = await dispatch(createPlaylistThunk({
            userId: user.id, 
            body: {
                name: `Playlist#${playlists.length + 1}`,
                collaborative: false,
                description: "",
                public: true,
            }
        })).unwrap();

        navigate(`/playlists/${playlist.id}`)
    }, [dispatch, navigate, playlists.length, user])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(value);
    }

    return (
        <header className={styles["library-header"]}>
            <div className={styles["library-header-container__one"]}>
                <SearchInput 
                    placeholder="Search in library"
                    value={value}
                    onChange={handleChange}
                    className={styles["library-header-input"]} 
                />
                <button 
                    className={styles["library-header-button"]} 
                    onClick={switchMode}
                >
                    {viewMode === "list" 
                    ? <ListIcon width={40} height={40} />
                    : <GridIcon width={40} height={40} />}
                </button>
            </div>
            <div className={styles["library-header-container__two"]}>
                <button 
                    className={styles["library-header-button"]} 
                    onClick={handleCreateFolder}
                >
                    <FolderIcon width={40} height={40} />
                    <Description>
                        Create folder
                    </Description>
                </button>
                <button 
                    className={styles["library-header-button"]}
                    onClick={async () => await handleCreatePlaylist()}
                >
                    <PlaylistIcon width={40} height={40} />
                    <Description>
                        Create playlist
                    </Description>
                </button>
            </div>
        </header>
    )
}