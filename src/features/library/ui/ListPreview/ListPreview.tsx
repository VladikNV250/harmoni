import { FC } from "react";
import { Paragraph } from "shared/ui";
import { useNavigate } from "react-router";
import { IAlbum } from "shared/api/album";
import { 
    Album, 
    ArtistIcon, 
    FolderIcon, 
    PinIcon, 
    PlaceholderFolderImage, 
    PlaceholderImage, 
    PlaylistIcon 
} from "shared/assets";
import styles from "./style.module.scss";
import { IShow } from "shared/api/show";
import { IEpisode } from "shared/api/episode";
import { IArtist } from "shared/api/artist";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import { IFolder } from "entities/folder";

interface IListPreview {
    /** Rendered item */
    readonly item: ISimplifiedPlaylist | IArtist | IEpisode | IShow | IAlbum | IFolder;
}

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

    const getImage = () => {
        const images = (item as IAlbum).images ;
        if (images?.[0]?.url) return images[0].url;
        
        switch (type) {
            case "folder": return PlaceholderFolderImage;
            default: return PlaceholderImage
        }
    }   

    return (
        <div className={styles["item"]} onClick={navigateToItem}>
            <img 
                src={getImage()} 
                className={styles["item-image"]} 
            />
            <button className={styles["item-button"]}>
                <PinIcon width={40} height={40} />
            </button>
            <button className={styles["item-button"]}>
                {renderIcon()}
            </button>
            <Paragraph className={styles["item-name"]}>
                {name}
            </Paragraph>
        </div>
    )
}