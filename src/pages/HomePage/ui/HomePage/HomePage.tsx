import { FC, useEffect, useState } from "react";
import { useTheme } from "entities/theme";
import { TagItem } from "../TagItem/TagItem";
import { AdjustContextMenu } from "../AdjustContextMenu/AdjustContextMenu";
import { RecommendationCard } from "../RecommendationCard/RecommendationCard";
import { Catalogue } from "widgets/Catalogue";
import Adjust from "shared/assets/icons/adjust-big.svg?react";
import clsx from "clsx";
import "./HomePage.scss";
import { useAppSelector } from "shared/lib";
import { selectPlaylists } from "entities/playlist";
import { selectFeeds } from "entities/feed";
import { selectArtists } from "entities/artist";
import { selectAudiobooks } from "entities/audiobook";
import { selectPodcasts } from "entities/podcast";
import { selectAlbums } from "entities/album";
import { fetchPlaylist } from "shared/api/playlist/fetchPlaylist";


export const HomePage: FC = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const feeds = useAppSelector(selectFeeds);
    const playlists = useAppSelector(selectPlaylists);
    const artists = useAppSelector(selectArtists);
    const albums = useAppSelector(selectAlbums);
    const audiobooks = useAppSelector(selectAudiobooks);
    const podcasts = useAppSelector(selectPodcasts);

    useEffect(() => {
        (async () => {
            console.log(await fetchPlaylist());
        })()
    }, [])

    return (
        <div className="home">
            <AdjustContextMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="filter-bar">
                <div className={clsx("tags-container", theme)}>
                    <div className="tags-slider">
                        <TagItem tag="Music" />
                        <TagItem tag="Podcasts" />
                        <TagItem tag="Audiobooks" />
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
                    feed.itemType === "audiobook" ?
                        <Catalogue
                            key={index} 
                            feed={feed}
                            list={audiobooks}
                        /> :
                    feed.itemType === "podcast" &&
                        <Catalogue
                            key={index} 
                            feed={feed}
                            list={podcasts}
                        />
                )}
            </div>
            
        </div>
    )
}