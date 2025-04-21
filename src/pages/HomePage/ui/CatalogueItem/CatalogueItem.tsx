import {
    FC,
    useRef
} from "react";
import {
    FeedHeader,
    IFeed
} from "entities/feed";
import { PlaylistPreview } from "entities/playlist";
import { AlbumPreview } from "entities/album";
import { ArtistPreview } from "entities/artist";
import { ShowPreview } from "entities/show";
import { EpisodePreview } from "entities/episode";
import { IPlaylist } from "shared/api/playlist";
import { IArtist } from "shared/api/artist";
import { IEpisode } from "shared/api/episode";
import { IShow } from "shared/api/show";
import { IAlbum } from "shared/api/album";
import styles from "./style.module.scss";


interface ICatalogueItem {
    /** Feed data containing items and metadata for rendering a catalogue section */
    readonly feed: IFeed;
}

/**
 * @component CatalogueItem
 * @description Renders a single feed section with its content carousel and header.
 */
export const CatalogueItem: FC<ICatalogueItem> = ({ feed }) => {
    const carouselRef = useRef(null);

    const renderFeedItems = (items: IFeed["items"]) => {
        return items
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
            )

    }

    return (
        <div
            className={styles["catalogue-item"]}
            style={{
                order: feed.order
            }}
        >
            <div
                ref={carouselRef}
                className={styles["carousel"]}
            >
                {renderFeedItems(feed.items)}
            </div>
            <FeedHeader feed={feed} carouselRef={carouselRef} />
        </div>
    );
}