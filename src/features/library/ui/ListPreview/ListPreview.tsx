import { FC } from "react";
import { useNavigate } from "react-router";
import { IFolder } from "entities/folder";
import {
    Description,
    Paragraph
} from "shared/ui";
import {
    Album,
    ArtistIcon,
    FolderIcon,
    PlaceholderFolderImage,
    PlaceholderImage,
    PlaylistIcon
} from "shared/assets";
import { IAlbum } from "shared/api/album";
import { IShow } from "shared/api/show";
import { IEpisode } from "shared/api/episode";
import { IArtist } from "shared/api/artist";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import styles from "./style.module.scss";

interface IListPreview {
    /** Rendered item */
    readonly item: ISimplifiedPlaylist | IArtist | IEpisode | IShow | IAlbum | IFolder;
}

/**
 * @component ListPreview
 * @description Component is responsible for render items (playlist, album, artist..) in the from of a list.
 * 
 * Typically used when you need to render an item in the "list" view mode.
 */
export const ListPreview: FC<IListPreview> = ({ item }) => {
    const { name, id, type } = item;
    const navigate = useNavigate();

    const navigateToItem = () => {
        switch (type) {
            case "playlist":
                navigate(`/playlists/${id}`);
                break;
            case "album":
                navigate(`/albums/${id}`);
                break;
            case "artist":
                navigate(`/artists/${id}`);
                break;
            case "show":
                navigate(`/shows/${id}`);
                break;
            case "episode":
                navigate(`/episodes/${id}`);
                break;
            case "folder":
                navigate(`/folders/${id}`);
                break;
        }
    }

    const renderIcon = () => {
        switch (type) {
            case "playlist":
                return <PlaylistIcon width={40} height={40} />
            case "artist":
                return <ArtistIcon width={40} height={40} />
            case "episode":
                return <PlaylistIcon width={40} height={40} />
            case "show":
                return <PlaylistIcon width={40} height={40} />
            case "album":
                return <Album width={40} height={40} />
            case "folder":
                return <FolderIcon width={40} height={40} />
        }
    }

    const renderContent = () => {
        switch (type) {
            case "playlist":
                return [
                    <Description className={styles["item-text"]}>
                        {item.description ?? ""}
                    </Description>,
                    <Description className={styles["item-text"]}>
                        {item.tracks.total > 0
                            ? item.tracks.total + " tracks"
                            : ""}
                    </Description>
                ]
            case "artist":
                return null;
            case "show":
                return [
                    <Description className={styles['item-text']}>
                        {item.publisher ?? ""}
                    </Description>,
                    <Description className={styles["item-text"]}>
                        {item.episodes?.total > 0
                            ? item.episodes?.total + " episodes"
                            : ""}
                    </Description>
                ]
            case "album":
                return [
                    <Description className={styles['item-text']}>
                        {item.artists.map(({ name }) => name).join(', ') ?? ""}
                    </Description>,
                    <Description className={styles['item-text']}>
                        {item.tracks.total > 0
                            ? item.tracks.total + " songs"
                            : ""}
                    </Description>
                ]
            case "folder":
                return (
                    <Description className={styles["item-text"]}>
                        {item.items.length > 0
                            ? item.items.length + " playlists"
                            : ""}
                    </Description>
                )
            case "episode":
                return null;
        }
    }

    const getImage = () => {
        const images = (item as IAlbum).images;
        if (images?.[0]?.url) return images[0].url;

        switch (type) {
            case "folder": return PlaceholderFolderImage;
            default: return PlaceholderImage
        }
    }

    return (
        <div className={styles["item"]} onClick={navigateToItem}>
            <button className={styles["item-button"]}>
                {renderIcon()}
            </button>
            <img
                src={getImage()}
                className={styles["item-image"]}
            />
            <Paragraph className={styles["item-name"]}>
                {name}
            </Paragraph>
            {renderContent()}
        </div>
    )
}