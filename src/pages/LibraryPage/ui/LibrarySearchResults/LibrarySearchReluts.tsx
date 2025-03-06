import { 
    ListPreview, 
    selectFollowedArtists, 
    selectSavedAlbums, 
    selectSavedPlaylists, 
    selectSavedShows 
} from "features/library";
import { FC, useMemo } from "react";
import { useAppSelector } from "shared/lib";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import { IArtist } from "shared/api/artist";
import { IAlbum } from "shared/api/album";
import { IShow } from "shared/api/show";
import styles from "./style.module.scss";

interface ILibrarySearchResults {
    readonly query: string;
}

export const LibrarySearchResults: FC<ILibrarySearchResults> = ({ query }) => {
    const playlists = useAppSelector(selectSavedPlaylists);
    const albums = useAppSelector(selectSavedAlbums);
    const shows = useAppSelector(selectSavedShows);
    const artists = useAppSelector(selectFollowedArtists);

    const searchedItems = useMemo(() => {
        if (query !== "") {
            const lowerCasedValue = query.toLowerCase();

            const findedPlaylists = playlists.filter(playlist => 
                playlist.name.toLowerCase().includes(lowerCasedValue)
            )
            const findedAlbums = albums.filter(album =>
                album.album.name.toLowerCase().includes(lowerCasedValue)
            ).map(({album}) => album)
            const findedShows = shows.filter(show =>
                show.show.name.toLowerCase().includes(lowerCasedValue)
            ).map(({show}) => show)
            const findedArtists = artists.filter(artist =>
                artist.name.toLowerCase().includes(lowerCasedValue)
            )

            return [
                ...findedPlaylists,
                ...findedAlbums,
                ...findedShows,
                ...findedArtists,
            ];
        } else {
            return [];
        }
    }, [query, playlists, albums, shows, artists])

    const renderSearchedItems = (items: (ISimplifiedPlaylist | IArtist | IAlbum | IShow)[]) => {
        return items.map(item => 
            <ListPreview key={item.id + "-search"} item={item} />
        )
    }

    return (
        <div className={styles["library-group-search"]}>
            {renderSearchedItems(searchedItems)}
        </div>
    )
}