import { 
    FC, 
    useCallback, 
    useEffect, 
    useState 
} from "react";
import { 
    GridIcon, 
    ListIcon, 
    Sort 
} from "shared/assets";
import { 
    Description, 
    Loader, 
    Title 
} from "shared/ui";
import { 
    getLibraryPlaylists, 
    ListPreview, 
    selectFolders, 
    selectLibraryLoading, 
    useView 
} from "features/library";
import { 
    useParams 
} from "react-router";
import { 
    useAppDispatch, 
    useAppSelector, 
} from "shared/lib";
import { 
    getUserInfo, 
    selectUserLoading 
} from "entities/user";
import { 
    IPlaylist, 
    ISimplifiedPlaylist 
} from "shared/api/playlist";
import { 
    PLAYLIST_SORT_TYPES, 
    SortMenu, 
    TPlaylistSortBy, 
    TSortOrder 
} from "features/sort";
import { IFolder } from "entities/folder";
import { PlaylistPreview } from "entities/playlist";
import { usePlaybackAdapter } from "entities/playback";
import { fetchPlaybackState } from "entities/playback/api/playback";
import { FolderControlPanel } from "../FolderControlPanel/FolderControlPanel";
import styles from "./style.module.scss";


const FolderPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [folder, setFolder] = useState<IFolder | null>(null);
    const folders = useAppSelector(selectFolders);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const userLoading = useAppSelector(selectUserLoading);
    const { viewMode, switchMode } = useView();
    const { setApiPlayback } = usePlaybackAdapter();
    const [sort, setSort] = useState<{
        isOpen: boolean,
        by: TPlaylistSortBy,
        order: TSortOrder
    }>({
        isOpen: false,
        by: "Recently added",
        order: "Ascending"
    });

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

        (async () => {
            setApiPlayback?.(await fetchPlaybackState());
        })()
    }, [dispatch, setApiPlayback]);

    const sortPlaylists = useCallback((playlists: (IPlaylist | ISimplifiedPlaylist)[]): (IPlaylist | ISimplifiedPlaylist)[] => {
        const sortedPlaylists = [...playlists];

        switch (sort.by) {
            case "Alphabetical":
                sortedPlaylists.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    } else if (a.name > b.name) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                break;
            case "Creator":
                sortedPlaylists.sort((a, b) => {
                    if (!a.owner.display_name || !b.owner.display_name) {
                        return 0;
                    }
                    if (a.owner.display_name < b.owner.display_name) {
                        return -1;
                    } else if (a.owner.display_name > b.owner.display_name) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                break;
        }

        if (sort.order === "Descending") {
            return sortedPlaylists.reverse();
        } else {
            return sortedPlaylists;
        }
    }, [sort.by, sort.order])

    const renderItems = (items: (IPlaylist | ISimplifiedPlaylist)[]) => {
        const sortedItems = sortPlaylists(items);

        switch (viewMode) {
            case "list":
                return (
                    <div className={styles["folder-list"]}>
                        {sortedItems.map(item => 
                            <ListPreview key={item.id} item={item} />
                        )}
                    </div>
                )
            case "grid":
                return (
                    <div className={styles["folder-grid"]}>
                        {sortedItems.map(item => 
                            <PlaylistPreview key={item.id} playlist={item} />
                        )}
                    </div>
                )
        }
    }

    return (
        <div className={styles["folder"]}>
            <Loader loading={userLoading || libraryLoading} />
            <SortMenu<TPlaylistSortBy> 
                sort={sort}
                setSort={setSort}
                sortTypes={PLAYLIST_SORT_TYPES}
            />
            <FolderControlPanel folder={folder} />
            <div className={styles["folder-body"]}>
                <header className={styles['folder-body-header']}>
                    <button 
                        className={styles['folder-body-button']}
                        onClick={() => setSort(prevState => ({...prevState, isOpen: true}))}
                    >
                        <Sort width={40} height={40} />
                        <Description>
                            {sort.by}
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