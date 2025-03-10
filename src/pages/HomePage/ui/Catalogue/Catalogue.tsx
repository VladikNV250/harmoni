import { AlbumPreview } from "entities/album";
import { ArtistPreview } from "entities/artist";
import { EpisodePreview } from "entities/episode";
import { 
    FeedHeader, 
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
import { PlaylistPreview } from "entities/playlist";
import { ShowPreview } from "entities/show";
import { FC, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import { IAlbum } from "shared/api/album";
import { IArtist } from "shared/api/artist";
import { IEpisode } from "shared/api/episode";
import { IPlaylist } from "shared/api/playlist";
import { IShow } from "shared/api/show";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { STANDARD_FEEDS } from "shared/consts";
import "react-alice-carousel/lib/scss/alice-carousel.scss"
import styles from "./style.module.scss";


interface ICatalogue {
    readonly type?: TFeedFilter;
}

export const Catalogue: FC<ICatalogue> = ({ type = "All" }) => {
    const feeds = useAppSelector(selectFeeds);
    const { filteredFeeds }  = useFilterFeeds(feeds, type);
    const { updateAfterEveryReload } = useAppSelector(selectFeedSettings);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (updateAfterEveryReload || Object.keys(feeds).length === 0) { // get fresh feeds after every reload or if feeds store is empty
            dispatch(getNewReleases({name: "New Releases", order: -1}));
            STANDARD_FEEDS.forEach(({name, type, ids, order, hidden}) => {
                switch (type) {
                    case "playlist":
                        dispatch(getFeedPlaylists({name, ids, order, hidden}));
                        break;
                    case "show":
                        dispatch(getFeedShows({name, ids, order, hidden}));
                        break;
                    case "episode":
                        dispatch(getFeedEpisodes({name, ids, order, hidden}));
                        break;
                    case "album":
                        dispatch(getFeedAlbums({name, ids, order, hidden}));
                        break;
                    case "artist":
                        dispatch(getFeedArtists({name, ids, order, hidden}));
                        break;
                }
            })
            dispatch(getUserTopArtists({name: "Your Top Artists", order: -2}));
        }
        
    }, [dispatch]);
    
    const renderFeedItems = (items: IFeed["items"]) => {
        const responsive = {
            0: { items: items.length }
        };
            
        return (
            <AliceCarousel 
                autoWidth
                disableDotsControls
                disableButtonsControls
                mouseTracking
                paddingRight={(items.length - 1) * 9}
                responsive={responsive}
            >
                {items
                    .filter(item => item)
                    .map((item: IPlaylist | IArtist | IEpisode | IShow | IAlbum, index: number) => 
                        item.type === "playlist" ?
                            <PlaylistPreview key={index} playlist={item} /> :
                        item.type === "album" ?
                            <AlbumPreview key={index} album={item} /> :
                        item.type === "artist" ?
                            <ArtistPreview key={index} artist={item} /> :
                        item.type === "show" ?
                            <ShowPreview key={index} show={item} /> :
                        item.type === "episode" && 
                            <EpisodePreview key={index} episode={item} />
                    )}
            </AliceCarousel>
        )
    }

    const renderFeeds = (feeds: {
        [key: string]: IFeed,
    }) => {
        return Object.keys(feeds)?.map(feedName => 
            (feeds[feedName].items.length > 0 && !feeds[feedName].hidden.isHidden) &&
            <div 
                key={feedName} 
                className={styles["catalogue"]} 
                style={{
                    order: feeds[feedName].order
                }}
            >
                <FeedHeader name={feedName} />
                {renderFeedItems(feeds[feedName].items)}
            </div>
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