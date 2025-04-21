import {
    ChangeEvent,
    FC,
    useCallback
} from "react";
import { shallowEqual } from "react-redux";
import { useNavigate } from "react-router";
import {
    createPlaylistThunk,
    librarySlice,
    selectFolders,
    selectSavedPlaylists
} from "features/library";
import { selectUser } from "entities/user";
import {
    Description,
    ExpandableSearchInput,
    SearchInput
} from "shared/ui";
import {
    AddFolder,
    AddToPlaylist,
    GridIcon,
    ListIcon,
} from "shared/assets";
import {
    useAppDispatch,
    useAppSelector
} from "shared/lib";
import styles from "./style.module.scss";

interface ILibraryHeader {
    /** Search query string used to filter saved library items. */
    readonly query: string;
    /** Callback to change query string.  */
    readonly setQuery: (value: string) => void;
    /** View mode for displaying items: 
     * - "list" - detailed row view (via ListPreview) 
     * - "grid" - card preview (via each entity's Preview component) 
     */
    readonly viewMode: "list" | "grid";
    /** Callback to switch between viewing modes. */
    readonly switchMode: () => void;
}

/**
 * @component LibraryHeader
 * @description Header panel for the library that provides controls 
 * for switching view mode, searching through saved items, and creating a new folder or playlist.
 */
export const LibraryHeader: FC<ILibraryHeader> = ({ query, setQuery, viewMode, switchMode }) => {
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
                name: `New Playlist #${playlists.length + 1}`,
                collaborative: false,
                description: "",
                public: true,
            }
        })).unwrap();

        navigate(`/playlists/${playlist.id}`);
    }, [dispatch, navigate, playlists.length, user])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setQuery(value);
    }

    return (
        <header className={styles["library-header"]}>
            <div className={styles["library-header-container__one"]}>
                <SearchInput
                    placeholder="Search in library"
                    value={query}
                    onChange={handleChange}
                    className={styles["library-header-input__mobile"]}
                />
                <button
                    className={styles["library-header-button"]}
                    onClick={switchMode}
                >
                    {viewMode === "list"
                        ? <ListIcon width={40} height={40} />
                        : <GridIcon width={40} height={40} />}
                </button>
                <ExpandableSearchInput
                    placeholder="Search in library"
                    value={query}
                    onChange={handleChange}
                    className={styles["library-header-input__desktop"]}
                    direction="right"
                />
            </div>
            <div className={styles["library-header-container__two"]}>
                <button
                    className={styles["library-header-button"]}
                    onClick={handleCreateFolder}
                >
                    <AddFolder width={40} height={40} />
                    <Description className={styles["button-text"]}>
                        Create folder
                    </Description>
                </button>
                <button
                    className={styles["library-header-button"]}
                    onClick={async () => await handleCreatePlaylist()}
                >
                    <AddToPlaylist width={40} height={40} />
                    <Description className={styles["button-text"]}>
                        Create playlist
                    </Description>
                </button>
            </div>
        </header>
    )
}