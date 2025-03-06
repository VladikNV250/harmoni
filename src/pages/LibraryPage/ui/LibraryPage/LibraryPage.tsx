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
    useDebounce
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
import styles from "./style.module.scss";
import { LibraryGroupList } from "../LibraryGroupList/LibraryGroupList";
import { LibraryHeader } from "../LibraryHeader/LibraryHeader";



const LibraryPage: FC = () => {
    const dispatch = useAppDispatch();
    const { viewMode, switchMode } = useView();
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 300);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const userLoading = useAppSelector(selectUserLoading);        

    useEffect(() => {
        dispatch(getLikedTracks());
        dispatch(getLibraryPlaylists());
        dispatch(getLibraryAlbums());
        dispatch(getLibraryShows());
        dispatch(getLibraryArtists());
        dispatch(getUserInfo());
    }, [dispatch]);


    return (
        <div className={styles["library"]}>
            <Loader loading={libraryLoading || userLoading} />
            <LibraryHeader 
                value={value}
                setValue={setValue}
                viewMode={viewMode}
                switchMode={switchMode}
            />
            <LibraryGroupList 
                query={`${debouncedValue}`}
                viewMode={viewMode}
            />
        </div>
    )
}

export default LibraryPage;