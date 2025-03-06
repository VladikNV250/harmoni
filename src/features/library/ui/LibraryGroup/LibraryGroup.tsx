import { FC, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { RightIcon } from "shared/assets";
import { Title } from "shared/ui";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import { IArtist } from "shared/api/artist";
import { IEpisode } from "shared/api/episode";
import { IShow } from "shared/api/show";
import { IAlbum } from "shared/api/album";
import { PlaylistPreview } from "entities/playlist";
import { AlbumPreview } from "entities/album";
import { ArtistPreview } from "entities/artist";
import { EpisodePreview } from "entities/episode";
import { ShowPreview } from "entities/show";
import "react-alice-carousel/lib/scss/alice-carousel.scss"
import clsx from "clsx";
import { ListPreview } from "../ListPreview/ListPreview";
import styles from "./style.module.scss";
import { FolderPreview, IFolder } from "entities/folder";

interface ILibraryGroup {
    title: string;
    items: (ISimplifiedPlaylist | IArtist | IEpisode | IShow | IAlbum | IFolder)[];
    viewMode: "list" | "grid";
}

export const LibraryGroup: FC<ILibraryGroup> = ({ title, items, viewMode }) => {
    const [active, setActive] = useState(false);

    const responsive = {
        0: { items: items.length }
    }

    const renderItem = (item: ISimplifiedPlaylist | IArtist | IEpisode | IShow | IAlbum | IFolder) => {
        switch (item.type) {
            case "playlist": 
                return <PlaylistPreview key={item.id} playlist={item} />
            case "artist" : 
                return <ArtistPreview key={item.id} artist={item} />
            case "episode":
                return <EpisodePreview key={item.id} episode={item} />
            case "show":
                return <ShowPreview key={item.id} show={item} />
            case "album":
                return <AlbumPreview key={item.id} album={item} />
            case "folder":
                return <FolderPreview key={item.id} folder={item} />
            default:
                return null;
        }        
    }

    const renderLibraryGroup = () => {
        switch (viewMode) {
            case "list": 
                return (
                    <div className={styles["library-group-list"]}>
                        {
                        items
                            .filter(item => item)
                            .map((item) => 
                                <ListPreview key={item.id} item={item} />
                            )
                        }
                    </div>
                )
            case "grid":
                return (
                    <AliceCarousel 
                        autoWidth
                        disableDotsControls
                        disableButtonsControls
                        mouseTracking
                        paddingRight={(items.length - 1) * 9} // 9 - gap between elements
                        responsive={responsive}
                    >
                        {
                        items
                            .filter(item => item)
                            .map((item) => renderItem(item))
                        }
                    </AliceCarousel>
                )
        }
    }

    if (items.length > 0) return (
        <div 
            className={clsx(
                styles["library-group"],
                active && styles["active"]
            )}
        >
            <header 
                className={styles["library-group-header"]} 
                onClick={() => setActive(!active)}
            >
                <Title className={styles["library-group-title"]}>
                    {title}
                </Title>
                <button className={styles["library-group-button"]}>
                    <RightIcon width={40} height={40} />
                </button>
            </header>
            <div className={styles["library-group-container"]}>
                {renderLibraryGroup()}
            </div>
        </div>
    )
}