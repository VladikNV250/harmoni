import { FC, useMemo } from "react";
import { LibrarySearchResults } from "../LibrarySearchResults/LibrarySearchReluts";
import { Title } from "shared/ui";
import { 
    LibraryGroup, 
    selectFolders, 
    selectFollowedArtists, 
    selectSavedAlbums, 
    selectSavedPlaylists, 
    selectSavedShows 
} from "features/library";
import { useAppSelector } from "shared/lib";
import { shallowEqual } from "react-redux";
import styles from "./style.module.scss";

interface ILibraryGroupList {
    readonly query: string;
    readonly viewMode: "list" | "grid";
}

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