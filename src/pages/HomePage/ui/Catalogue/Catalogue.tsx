import {
    FC,
    useEffect
} from "react";
import {
    getFeedAlbums,
    getFeedArtists,
    getFeedEpisodes,
    getFeedPlaylists,
    getFeedShows,
    getNewReleases,
    getUserTopArtists,
    IFeed,
    selectFeeds,
    selectFeedSettings,
    TFeedFilter,
    useFilterFeeds
} from "entities/feed";
import {
    useAppDispatch,
    useAppSelector
} from "shared/lib";
import { STANDARD_FEEDS } from "shared/consts";
import { CatalogueItem } from "../CatalogueItem/CatalogueItem";
import styles from "./style.module.scss";


interface ICatalogue {
    /** Optional filter type to display specific feeds (e.g. "Album", "Artist", etc.) */
    readonly type?: TFeedFilter;
}

/** 
 * @component Catalogue
 * @description Fetches and renders a list of content feeds on the home page.
 * Allows optional filtering by feed type (e.g. playlists, albums, artists).
 */
export const Catalogue: FC<ICatalogue> = ({ type = "All" }) => {
    const feeds = useAppSelector(selectFeeds);
    const { filteredFeeds } = useFilterFeeds(feeds, type);
    const { updateAfterEveryReload } = useAppSelector(selectFeedSettings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        /** Get fresh feeds after every load the home page or if feeds store is empty */
        if (updateAfterEveryReload || Object.keys(feeds).length === 0) { // 
            dispatch(getNewReleases({ name: "New Releases", order: -1 }));
            STANDARD_FEEDS.forEach(({ name, type, ids, order, hidden }) => {
                switch (type) {
                    case "playlist":
                        dispatch(getFeedPlaylists({ name, ids, order, hidden }));
                        break;
                    case "show":
                        dispatch(getFeedShows({ name, ids, order, hidden }));
                        break;
                    case "episode":
                        dispatch(getFeedEpisodes({ name, ids, order, hidden }));
                        break;
                    case "album":
                        dispatch(getFeedAlbums({ name, ids, order, hidden }));
                        break;
                    case "artist":
                        dispatch(getFeedArtists({ name, ids, order, hidden }));
                        break;
                }
            })
            dispatch(getUserTopArtists({ name: "Your Top Artists", order: -2 }));
        }
    }, [dispatch]);



    const renderFeeds = (feeds: {
        [key: string]: IFeed,
    }) => {
        return Object.keys(feeds)?.map(feedName =>
            (feeds[feedName].items.length > 0 && !feeds[feedName].hidden.isHidden) &&
            <CatalogueItem
                key={feedName}
                feed={feeds[feedName]}
            />
        )
    }

    return (
        <div className={styles["catalogues-container"]}>
            {Object.keys(filteredFeeds).length > 0
                ? renderFeeds(filteredFeeds)
                : renderFeeds(feeds)
            }
        </div>
    )
}