import { FC, useEffect, useState } from "react";
import { useTheme } from "entities/theme";
import { TagItem } from "../TagItem/TagItem";
import { AdjustContextMenu } from "../AdjustContextMenu/AdjustContextMenu";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import { Catalogue } from "widgets/Catalogue";
import Adjust from "shared/assets/icons/adjust-big.svg?react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { getPlaylist, selectPlaylists } from "entities/playlist";
import { selectFeeds } from "entities/feed";
import { getArtist, selectArtists } from "entities/artist";
import { getAlbum, selectAlbums } from "entities/album";
import { getShow, selectShows } from "entities/show";
import { getEpisode, selectEpisodes } from "entities/episode";
import { getTrack } from "entities/track";
import "./HomePage.scss";


export const HomePage: FC = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useAppDispatch();
    const feeds = useAppSelector(selectFeeds);
    const playlists = useAppSelector(selectPlaylists);
    const artists = useAppSelector(selectArtists);
    const albums = useAppSelector(selectAlbums);
    const shows = useAppSelector(selectShows);
    const episodes = useAppSelector(selectEpisodes);

    useEffect(() => {
        dispatch(getTrack("2kol6tv2jcinBERq425Ahv"))
        dispatch(getArtist("1PYz5uoK1NSdWERupvt8BR"));
        dispatch(getAlbum("2zFjd5mjFDv6LKG1wpV9rM"));
        dispatch(getPlaylist({id: "0l7czkexq5zuu2aWshvsFY"}));
        dispatch(getShow("4rOoJ6Egrf8K2IrywzwOMk"));
        dispatch(getEpisode("3wUQy68EVwNjTb0yBOhYm9"));
    }, [dispatch])

    return (
        <div className="home">
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
                {feeds.map((feed, index) => 
                    feed.itemType === "playlist" ?
                        <Catalogue
                            key={index} 
                            feed={feed}
                            list={playlists}
                        /> :
                    feed.itemType === "album" ?
                        <Catalogue
                            key={index} 
                            feed={feed}
                            list={albums}
                        /> :
                    feed.itemType === "artist" ?
                        <Catalogue
                            key={index} 
                            feed={feed}
                            list={artists}
                        /> :
                    feed.itemType === "show" ?
                        <Catalogue
                            key={index} 
                            feed={feed}
                            list={shows}
                        /> :
                    feed.itemType === "episode" &&
                        <Catalogue
                            key={index} 
                            feed={feed}
                            list={episodes}
                        />

                )}
            </div>
            
        </div>
    )
}