import {
    FC,
    useEffect,
    useState
} from "react";
import {
    getLibraryAlbums,
    getLibraryArtists,
    getLibraryPlaylists,
    getLibraryShows,
    getLikedTracks,
    selectLibraryLoading,
    useView
} from "features/library";
import {
    getUserInfo,
    selectUserLoading
} from "entities/user";
import {
    fetchPlaybackState,
    usePlaybackAdapter
} from "entities/playback";
import {
    Loader,
} from "shared/ui";
import {
    useAppDispatch,
    useAppSelector,
    useDebounce,
    useWindowDimensions
} from "shared/lib";
import { LibraryHeader } from "../LibraryHeader/LibraryHeader";
import { LibraryFlatList } from "../LibraryFlatList/LibraryFlatList";
import { LibraryGroupList } from "../LibraryGroupList/LibraryGroupList";
import styles from "./style.module.scss";



const LibraryPage: FC = () => {
    const dispatch = useAppDispatch();
    const { viewMode, switchMode } = useView();
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 300);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const userLoading = useAppSelector(selectUserLoading);
    const { setApiPlayback } = usePlaybackAdapter();
    const { width } = useWindowDimensions();

    useEffect(() => {
        dispatch(getLikedTracks());
        dispatch(getLibraryPlaylists());
        dispatch(getLibraryAlbums());
        dispatch(getLibraryShows());
        dispatch(getLibraryArtists());
        dispatch(getUserInfo());

        (async () => {
            setApiPlayback?.(await fetchPlaybackState());
        })()
    }, [dispatch, setApiPlayback]);


    return (
        <div className={styles["library"]}>
            <Loader loading={libraryLoading || userLoading} />
            <LibraryHeader
                query={query}
                setQuery={setQuery}
                viewMode={viewMode}
                switchMode={switchMode}
            />
            {width >= 768
                ?
                <LibraryFlatList
                    query={`${debouncedQuery}`}
                    viewMode={viewMode}
                />
                :
                <LibraryGroupList
                    query={`${debouncedQuery}`}
                    viewMode={viewMode}
                />
            }
        </div>
    )
}

export default LibraryPage;