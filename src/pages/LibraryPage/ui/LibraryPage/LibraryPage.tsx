import { 
    FC, 
    useEffect, 
    useState
} from "react";
import { 
    Loader, 
} from "shared/ui";
import { 
    useAppDispatch, 
    useAppSelector, 
    useDebounce,
    useWindowDimensions
} from "shared/lib";
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
import { LibraryGroupList } from "../LibraryGroupList/LibraryGroupList";
import { LibraryHeader } from "../LibraryHeader/LibraryHeader";
import { fetchPlaybackState, usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";
import { LibraryFlatList } from "../LibraryFlatList/LibraryFlatList";



const LibraryPage: FC = () => {
    const dispatch = useAppDispatch();
    const { viewMode, switchMode } = useView();
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 300);
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
                value={value}
                setValue={setValue}
                viewMode={viewMode}
                switchMode={switchMode}
            />
            {width >= 768 
            ?
            <LibraryFlatList 
                query={`${debouncedValue}`}
                viewMode={viewMode}
            />
            :
            <LibraryGroupList 
                query={`${debouncedValue}`}
                viewMode={viewMode}
            />
            }
        </div>
    )
}

export default LibraryPage;