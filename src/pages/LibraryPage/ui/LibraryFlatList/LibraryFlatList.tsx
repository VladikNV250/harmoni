import {
    FC,
    useCallback,
} from "react";
import { shallowEqual } from "react-redux";
import {
    ListPreview,
    selectFolders,
    selectFollowedArtists,
    selectLibraryFilter,
    selectSavedAlbums,
    selectSavedPlaylists,
    selectSavedShows
} from "features/library";
import { FolderPreview } from "entities/folder";
import { PlaylistPreview } from "entities/playlist";
import { ArtistPreview } from "entities/artist";
import { ShowPreview } from "entities/show";
import { AlbumPreview } from "entities/album";
import { useAppSelector } from "shared/lib";
import { Title } from "shared/ui";
import { LibrarySearchResults } from "../LibrarySearchResults/LibrarySearchReluts";
import styles from "./style.module.scss";


interface ILibraryFlatList {
    /** Search query string used to filter and display matching items */
    readonly query: string;
    /** View mode for displaying items: 
     * - "list" - detailed row view (via ListPreview) 
     * - "grid" - card preview (via each entity's Preview component)
     */
    readonly viewMode: "list" | "grid";
}

/**
 * @component LibraryFlatList
 * @description Component responsible for rendering all saved items (folders, albums, playlists..) 
 * in flat list view, filtered by selected type and optionaly by search query. 
 * 
 * Unlike LibraryGroupList, this component doesn't group items by type and instead 
 * renders them as a continious list or grid.
 */
export const LibraryFlatList: FC<ILibraryFlatList> = ({ query, viewMode }) => {
    const playlists = useAppSelector(selectSavedPlaylists, shallowEqual);
    const albums = useAppSelector(selectSavedAlbums, shallowEqual);
    const shows = useAppSelector(selectSavedShows, shallowEqual);
    const artists = useAppSelector(selectFollowedArtists, shallowEqual);
    const folders = useAppSelector(selectFolders, shallowEqual);
    const filter = useAppSelector(selectLibraryFilter);

    const filterItems = useCallback(() => {
        switch (filter) {
            case "all":
                return [
                    ...folders,
                    ...playlists,
                    ...albums.map(({ album }) => album),
                    ...shows.map(({ show }) => show),
                    ...artists
                ]
            case "folder":
                return folders;
            case "playlist":
                return playlists;
            case "album":
                return albums.map(({ album }) => album);
            case "show":
                return shows.map(({ show }) => show);
            case "artist":
                return artists;
        }
    }, [filter, playlists, albums, shows, artists, folders])

    const renderItems = () => {
        const items = filterItems();

        switch (viewMode) {
            case "list":
                return items.map(item =>
                    <ListPreview key={item.id} item={item} />
                )
            case "grid":
                return items.map(item => {
                    switch (item.type) {
                        case "playlist":
                            return <PlaylistPreview key={item.id} playlist={item} />
                        case "artist":
                            return <ArtistPreview key={item.id} artist={item} />
                        case "show":
                            return <ShowPreview key={item.id} show={item} />
                        case "album":
                            return <AlbumPreview key={item.id} album={item} />
                        case "folder":
                            return <FolderPreview key={item.id} folder={item} />
                        default:
                            return null;
                    }
                })
        }
    }

    return (
        <div className={styles["library-items"]}>
            {renderItems().length === 0 &&
                <Title className={styles["library-empty"]}>
                    The library is empty..
                </Title>}
            {query !== ""
                ?
                <LibrarySearchResults query={query} />
                :
                renderItems()
            }
        </div>
    )
}