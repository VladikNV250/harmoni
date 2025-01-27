import { FC } from "react";
import { FeedHeader, IFeed } from "entities/feed";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/scss/alice-carousel.scss"
import { IAlbum, IArtist, IEpisode, IPlaylist, IShow } from "shared/types";
import { PlaylistCard } from "entities/playlist";
import { AlbumCard } from "entities/album";
import { ArtistCard } from "entities/artist";
import { ShowCard } from "entities/show";
import "./Catalogue.scss";
import { EpisodeCard } from "entities/episode";

interface ICatalogue {
    feed: IFeed;
    list: (IPlaylist | IShow | IArtist | IAlbum | IEpisode)[];
}

export const Catalogue: FC<ICatalogue> = ({ feed, list }) => {
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
                    {list.map((item: IPlaylist | IArtist | IEpisode | IShow | IAlbum, index) => 
                        item.type === "playlist" ?
                            <PlaylistCard key={index} playlist={item} /> :
                        item.type === "album" ?
                            <AlbumCard key={index} album={item} /> :
                        item.type === "artist" ?
                            <ArtistCard key={index} artist={item} /> :
                        item.type === "show" ?
                            <ShowCard key={index} show={item} /> :
                        item.type === "episode" && 
                            <EpisodeCard key={index} episode={item} />
                    )}
                </AliceCarousel>
            </div>
        </div>
    )
}