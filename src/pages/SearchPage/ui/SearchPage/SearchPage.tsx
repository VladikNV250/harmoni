import {
    ChangeEvent,
    FC,
    useEffect,
} from "react";
import {
    getLibraryAlbums,
    getLibraryArtists,
    getLibraryPlaylists,
    getLibraryShows,
    getLikedTracks,
    selectLibraryLoading
} from "features/library";
import {
    getSeveralBrowseCategories,
    searchForItemThunk,
    searchSlice,
    selectBrowseCategories,
    selectSearchLoading,
    selectSearchQuery,
} from "features/search";
import {
    getUserInfo,
    selectUser,
    selectUserLoading
} from "entities/user";
import {
    fetchPlaybackState,
    usePlaybackAdapter
} from "entities/playback";
import {
    Loader,
    SearchInput,
    Subtitle,
    Title
} from "shared/ui";
import {
    useAppDispatch,
    useAppSelector,
    useDebounce,
} from "shared/lib";
import { ICategory } from "shared/api/category";
import { BrowseCategory } from "../BrowseCategory/BrowseCategory";
import { SearchResults } from "../SearchResults/SearchResults";
import styles from "./style.module.scss";


const SearchPage: FC = () => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectBrowseCategories);
    const searchLoading = useAppSelector(selectSearchLoading);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const query = useAppSelector(selectSearchQuery);
    const { setQuery } = searchSlice.actions;
    const debouncedValue = useDebounce(query, 500);
    const { setApiPlayback } = usePlaybackAdapter();
    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);

    useEffect(() => {
        if (user === null) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user])

    useEffect(() => {
        dispatch(getSeveralBrowseCategories());
        (async () => {
            setApiPlayback?.(await fetchPlaybackState());
        })()
    }, [dispatch, setApiPlayback])

    useEffect(() => {
        if (debouncedValue !== "") {
            dispatch(searchForItemThunk({
                query: `${debouncedValue}`,
                type: ["album", "artist", "episode", "playlist", "show", "track"],
            }))
        }
    }, [debouncedValue, dispatch])

    useEffect(() => {
        dispatch(getLikedTracks());
        dispatch(getLibraryPlaylists());
        dispatch(getLibraryAlbums());
        dispatch(getLibraryShows());
        dispatch(getLibraryArtists());
    }, [dispatch])

    const renderCategories = (items: ICategory[]) => {
        return items.map(item =>
            <BrowseCategory key={item.id} category={item} />
        )
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        dispatch(setQuery(value));
    }


    return (
        <div className={styles["search"]}>
            <header className={styles["search-header"]}>
                <SearchInput
                    placeholder="What do you want to play?"
                    value={query}
                    onChange={handleChange}
                />
            </header>
            <Loader
                loading={searchLoading || libraryLoading || userLoading}
                className={styles["search-loader"]}
            />
            {
                debouncedValue !== ""
                    ?
                    <SearchResults />
                    :
                    <div className={styles["search-browse"]}>
                        <Title className={styles["search-title"]}>
                            Browse All
                        </Title>
                        <Subtitle className={styles["search-subtitle"]}>
                            Discover
                        </Subtitle>
                        <div className={styles["search-content"]}>
                            {renderCategories(categories)}
                        </div>
                    </div>
            }
        </div>
    )
}

export default SearchPage;