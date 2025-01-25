import { FC } from "react";
import { FeedHeader, IFeed } from "entities/feed";
import { IPlaylist, PlaylistCard } from "entities/playlist";
import "./Catalogue.scss";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/scss/alice-carousel.scss"
import { ArtistCard, IArtist } from "entities/artist";
import { IPodcast, PodcastCard } from "entities/podcast";
import { AudiobookCard, IAudiobook } from "entities/audiobook";
import { AlbumCard, IAlbum } from "entities/album";

interface ICatalogue {
    feed: IFeed;
    list: (IPlaylist | IPodcast | IArtist | IAudiobook | IAlbum)[];
}

export const Catalogue: FC<ICatalogue> = ({ feed, list }) => {

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    const shuffledItems: 
        (IPlaylist | IPodcast | IArtist | IAudiobook | IAlbum)[] 
        = shuffleArray([...list]);

    const responsive = {
        0: { items: list.length }
    };

    return (
        <div className="catalogue">
            <FeedHeader 
                feed={feed} 
                list={list}
            />
            <div className="carousel-wrapper">
                <AliceCarousel 
                    autoWidth
                    disableDotsControls
                    disableButtonsControls
                    mouseTracking
                    paddingRight={(list.length - 1) * 9}
                    responsive={responsive}
                >
                    {shuffledItems.map((item: IPlaylist | IArtist | IAudiobook | IPodcast | IAlbum, index) => 
                        item.type === "playlist" ?
                            <PlaylistCard key={index} playlist={item} /> :
                        item.type === "album" ?
                            <AlbumCard key={index} album={item} /> :
                        item.type === "artist" ?
                            <ArtistCard key={index} artist={item} /> :
                        item.type === "podcast" ?
                            <PodcastCard key={index} podcast={item} /> :
                        item.type === "audiobook" &&
                            <AudiobookCard key={index} audiobook={item} />
                    )}
                </AliceCarousel>
            </div>
        </div>
    )
}