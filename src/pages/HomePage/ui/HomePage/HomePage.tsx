import { FC, useEffect, useState } from "react";
import { useTheme } from "entities/theme";
import { TagItem } from "../TagItem/TagItem";
import { AdjustContextMenu } from "../AdjustContextMenu/AdjustContextMenu";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import Adjust from "shared/assets/icons/adjust-big.svg?react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { FeedHeader, IFeed, selectFeedLoading, selectFeeds } from "entities/feed";
import { STANDARD_FEEDS } from "shared/consts";
import { getFeedAlbums, getFeedArtists, getFeedEpisodes, getFeedPlaylists, getFeedShows, getNewReleases, getUserTopArtists } from "entities/feed/model/feedThunk";
import AliceCarousel from "react-alice-carousel";
import { IAlbum } from "shared/api/album";
import { IShow } from "shared/api/show";
import { IEpisode } from "shared/api/episode";
import { IArtist } from "shared/api/artist";
import { IPlaylist } from "shared/api/playlist";
import { PlaylistPreview } from "entities/playlist";
import { AlbumPreview } from "entities/album";
import { ArtistPreview } from "entities/artist";
import { ShowPreview } from "entities/show";
import { EpisodePreview } from "entities/episode";
import { Loader } from "shared/ui/loaders/loader";
import "react-alice-carousel/lib/scss/alice-carousel.scss"
import "./HomePage.scss";


export const HomePage: FC = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const feeds = useAppSelector(selectFeeds);
    const loading = useAppSelector(selectFeedLoading);
    const dispatch = useAppDispatch();


    useEffect(() => {
        dispatch(getNewReleases());
        STANDARD_FEEDS.forEach(({name, type, ids}) => {
            switch (type) {
                case "playlist":
                    dispatch(getFeedPlaylists({name, ids}));
                    break;
                case "show":
                    dispatch(getFeedShows({name, ids}));
                    break;
                case "episode":
                    dispatch(getFeedEpisodes({name, ids}));
                    break;
                case "album":
                    dispatch(getFeedAlbums({name, ids}));
                    break;
                case "artist":
                    dispatch(getFeedArtists({name, ids}));
                    break;
            }
        })
        dispatch(getUserTopArtists());
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
                {items.map((item: IPlaylist | IArtist | IEpisode | IShow | IAlbum, index) => 
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
            <div className="catalogue" key={feedName}>
                <FeedHeader 
                    name={feedName}
                    list={feeds[feedName].items}
                />
                {renderFeedItems(feeds[feedName].items)}
            </div>
        )
    }

    return (
        <div className="home">
            <Loader loading={loading} />
            <AdjustContextMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="filter-bar">
                <div className={clsx("tags-container", theme)}>
                    <div className="tags-slider">
                        <TagItem tag="Music" />
                        <TagItem tag="Podcasts" />
                    </div>
                </div>
                <button className="button-adjust" onClick={() => setIsOpen(true)}>
                    <Adjust width={40} height={40} className="icon" />
                </button>                
            </div>
            <div className="recommendation-container">
                <RecommendationCard 
                    title="Get Lucky (feat. Pharrell Williams and Nile Rodgers)" 
                    artist="Daft Punk"
                />
                <RecommendationCard 
                    title="Daily Mix 2" 
                />
                <RecommendationCard 
                    title="Daily Mix 1" 
                />
                <RecommendationCard 
                    title="Instant Crush" 
                    artist="Daft Punk"
                />
                <RecommendationCard 
                    title="Around the world" 
                    artist="Daft Punk"
                />
                <RecommendationCard 
                    title="Rock Mix" 
                />
            </div>
            <div className="catalogues-container">
                {renderFeeds(feeds)}
            </div>
            
        </div>
    )
}