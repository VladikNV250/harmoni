import {
    FC,
    useState
} from "react";
import AliceCarousel from "react-alice-carousel";
import { AlbumPreview } from "entities/album";
import { ArtistPreview } from "entities/artist";
import { EpisodePreview } from "entities/episode";
import { ShowPreview } from "entities/show";
import { PlaylistPreview } from "entities/playlist";
import {
    FolderPreview,
    IFolder
} from "entities/folder";
import { RightIcon } from "shared/assets";
import { Title } from "shared/ui";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import { IArtist } from "shared/api/artist";
import { IEpisode } from "shared/api/episode";
import { IShow } from "shared/api/show";
import { IAlbum } from "shared/api/album";
import { ListPreview } from "../ListPreview/ListPreview";
import clsx from "clsx";
import "react-alice-carousel/lib/scss/alice-carousel.scss"
import styles from "./style.module.scss";


interface ILibraryGroup {
    /** Name of library group. */
    title: string;
    /** List of items, which will be rendered */
    items: (ISimplifiedPlaylist | IArtist | IEpisode | IShow | IAlbum | IFolder)[];
    /** View mode, which items will be rendered.
     * - "list" - items will be rendered throughout ListPreview component.
     * - "grid" - Items will be rendered throughout Preview components of items (e.g., AlbumPreview, PlaylistPreview..).
     */
    viewMode: "list" | "grid";
}

/**
 * @component LibraryGroup
 * @description Component responsible for rendering saved items in library. 
 * Render items in accordion, which can open and close.
 * List of items render in scrollable carousel.
 * 
 * Typicaly used in mobile version of app to display saved items.
 */
export const LibraryGroup: FC<ILibraryGroup> = ({ title, items, viewMode }) => {
    const [active, setActive] = useState(false);

    const responsive = {
        0: { items: items.length }
    }

    const renderItem = (item: ISimplifiedPlaylist | IArtist | IEpisode | IShow | IAlbum | IFolder) => {
        switch (item.type) {
            case "playlist":
                return <PlaylistPreview key={item.id} playlist={item} />
            case "artist":
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