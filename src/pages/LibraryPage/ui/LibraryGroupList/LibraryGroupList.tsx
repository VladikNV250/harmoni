import {
    FC,
    useMemo
} from "react";
import { shallowEqual } from "react-redux";
import {
    LibraryGroup,
    selectFolders,
    selectFollowedArtists,
    selectSavedAlbums,
    selectSavedPlaylists,
    selectSavedShows
} from "features/library";
import { Title } from "shared/ui";
import { useAppSelector } from "shared/lib";
import { LibrarySearchResults } from "../LibrarySearchResults/LibrarySearchReluts";
import styles from "./style.module.scss";

interface ILibraryGroupList {
    /** Search query string used to filter and display matching items */
    readonly query: string;
    /** View mode for displaying items: 
     * - "list" - detailed row view (via ListPreview) 
     * - "grid" - card preview (via each entity's Preview component) 
     */
    readonly viewMode: "list" | "grid";
}

/**
 * @component LibraryGroupList
 * @description Component responsible for rendering all saved items
 * (folders, albums, playlists...) grouped by type and optionally filtered by a search query.
 * 
 * Uses the LibraryGroup component to render each section, and switches between list or grid view mode.
 * If a query provided, the component renders LibrarySearchResults instead of grouped items.
 */
export const LibraryGroupList: FC<ILibraryGroupList> = ({ query, viewMode }) => {
    const playlists = useAppSelector(selectSavedPlaylists, shallowEqual);
    const albums = useAppSelector(selectSavedAlbums, shallowEqual);
    const shows = useAppSelector(selectSavedShows, shallowEqual);
    const artists = useAppSelector(selectFollowedArtists, shallowEqual);
    const folders = useAppSelector(selectFolders, shallowEqual);

    const isLibraryEmpty = useMemo(() => {
        return playlists.length === 0 &&
            albums.length === 0 &&
            shows.length === 0 &&
            artists.length === 0 &&
            folders.length === 0;
    }, [playlists.length, albums.length, shows.length, artists.length, folders.length])

    return (
        <div className={styles["library-groups"]}>
            {isLibraryEmpty &&
                <Title className={styles["library-empty"]}>
                    The library is empty..
                </Title>}
            {query !== ""
                ?
                <LibrarySearchResults query={query} />
                :
                <>
                    <LibraryGroup
                        viewMode={viewMode}
                        title="Folders"
                        items={folders}
                    />
                    <LibraryGroup
                        viewMode={viewMode}
                        title="Playlists"
                        items={playlists}
                    />
                    <LibraryGroup
                        viewMode={viewMode}
                        title="Albums"
                        items={albums.map(({ album }) => album)}
                    />
                    <LibraryGroup
                        viewMode={viewMode}
                        title="Shows"
                        items={shows.map(({ show }) => show)}
                    />
                    <LibraryGroup
                        viewMode={viewMode}
                        title="Artists"
                        items={artists}
                    />
                </>
            }
        </div>
    )
}