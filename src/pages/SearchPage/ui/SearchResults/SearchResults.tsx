import { useTheme } from "entities/theme";
import { 
    selectSearch, 
    TSearchFilter 
} from "features/search";
import { 
    FC,
    MouseEvent,
} from "react";
import { 
    useAppDispatch,
    useAppSelector, 
    useTabs 
} from "shared/lib";
import { 
    CategoryTabs, 
    Description, 
    OutlinedButton, 
    Paragraph 
} from "shared/ui";
import { ArtistList } from "entities/artist";
import { 
    AddIcon, 
    CheckFilled, 
} from "shared/assets";
import { ISimplifiedAlbum } from "shared/api/album";
import { IArtist } from "shared/api/artist";
import { ISimplifiedShow } from "shared/api/show";
import { ISimplifiedEpisode } from "shared/api/episode";
import { ITrack } from "shared/api/track";
import { 
    followPlaylist, 
    ISimplifiedPlaylist, 
    unfollowPlaylist 
} from "shared/api/playlist";
import { 
    getLibraryAlbums,
    getLibraryArtists,
    getLibraryPlaylists,
    getLibraryShows,
    getLikedTracks,
    selectFollowedArtists, 
    selectLikedTracks, 
    selectSavedAlbums, 
    selectSavedPlaylists, 
    selectSavedShows 
} from "features/library";
import { 
    followArtists, 
    removeAlbumsFromLibrary, 
    removeShowsFromLibrary, 
    removeTracksFromLibrary, 
    saveAlbumsToLibrary, 
    saveShowsToLibrary, 
    saveTracksToLibrary, 
    unfollowArtists 
} from "shared/api/user";
import { SearchItem } from "../SearchItem/SearchItem";
import clsx from "clsx";
import styles from "./style.module.scss";


export const SearchResults: FC = () => {
    const search = useAppSelector(selectSearch);
    const dispatch = useAppDispatch();
    const savedPlaylists = useAppSelector(selectSavedPlaylists);
    const savedAlbums = useAppSelector(selectSavedAlbums);
    const savedShows = useAppSelector(selectSavedShows);
    const savedArtists = useAppSelector(selectFollowedArtists);
    const savedTracks = useAppSelector(selectLikedTracks);
    const tabs: TSearchFilter[] = ["All", "Songs", "Albums", "Artists", "Playlists", "Shows"];
    const { theme } = useTheme();
    const { activeTab, chooseTab } = useTabs<TSearchFilter, "All">("All");


    const toggleLibraryItem = async (
        event: MouseEvent<HTMLButtonElement> ,
        id: string, 
        type: "album" | "track" | "episode" | "artist" | "playlist" | "show"
    ) => {
        event.stopPropagation();
        
        switch (type) {
            case "album":
                try {
                    if (savedAlbums.findIndex(({ album }) => album.id === id) !== -1) {
                        await removeAlbumsFromLibrary([id]);
                    } else {
                        await saveAlbumsToLibrary([id]);
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    dispatch(getLibraryAlbums());
                }
                break;
            case "track": 
                try {
                    if (savedTracks.findIndex(({ track }) => track.id === id) !== -1) {
                        await removeTracksFromLibrary([id]);
                    } else {
                        await saveTracksToLibrary([id]);
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    dispatch(getLikedTracks());
                }
                break;
            case "episode":
                try {
                    if (savedTracks.findIndex(({ track }) => track.id === id) !== -1) {
                        await removeTracksFromLibrary([id]);
                    } else {
                        await saveTracksToLibrary([id]);
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    dispatch(getLikedTracks());
                }
                break;
            case "artist":
                try {
                    if (savedArtists.findIndex(artist => artist.id === id) !== -1) {
                        await unfollowArtists([id]);
                    } else {
                        await followArtists([id]);
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    dispatch(getLibraryArtists());
                }
                break;
            case "playlist":
                try {
                    if (savedPlaylists.findIndex(playlist => playlist.id === id) !== -1) {
                        await unfollowPlaylist(id);
                    } else {
                        await followPlaylist(id);
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    dispatch(getLibraryPlaylists());
                }
                break;
            case "show":
                try {
                    if (savedShows.findIndex(({ show }) => show.id === id) !== -1) {
                        await removeShowsFromLibrary([id]);
                    } else {
                        await saveShowsToLibrary([id]);
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    dispatch(getLibraryShows());
                }
                break;
        }
    }    

    const renderTracks = (items: ITrack[]) => {
        if (items.length > 0 && (activeTab === "All" || activeTab === "Songs")) {
            return items.map((item) => 
                item &&
                <SearchItem 
                    key={item.id}
                    type={item.type}
                    link={`/albums/${item.album.id}`}
                    image={item.album.images?.[0].url ?? ""}
                    content={
                        <>
                            <Paragraph className={styles["search-item-name"]}>
                                {item.name}
                            </Paragraph>
                            <div className={styles["search-item-content"]}>
                                <Paragraph className={styles["search-item-type"]}>
                                    Song
                                </Paragraph>
                                <Paragraph>
                                    &#183;
                                </Paragraph>
                                <ArtistList artists={item.artists} />
                            </div>
                        </>
                    }
                    button={
                        <button 
                            className={clsx(
                                styles["search-item-button"],
                                savedTracks.findIndex(({ track }) => track.id === item.id) !== -1 && styles["active"]   
                            )}
                            onClick={async (e) => await toggleLibraryItem(e, item.id, item.type)}
                        >
                            <CheckFilled width={40} height={40} />
                            <AddIcon width={40} height={40} />
                        </button>
                    }
                />
            )
        }
    }

    const renderAlbums = (items: ISimplifiedAlbum[]) => {
        if (items.length > 0 && (activeTab === "All" || activeTab === "Albums")) {
            return items.map((item) => 
                item &&
                <SearchItem 
                    key={item.id}
                    type={item.type}
                    link={`/albums/${item.id}`}
                    image={item.images?.[0].url ?? ""}
                    content={
                        <>
                            <Paragraph className={styles["search-item-name"]}>
                                {item.name}
                            </Paragraph>
                            <div className={styles["search-item-content"]}>
                                <Paragraph className={styles["search-item-type"]}>
                                    {item.album_type}
                                </Paragraph>
                                <Paragraph>
                                    &#183;
                                </Paragraph>
                                <ArtistList artists={item.artists} />
                            </div>
                        </>
                    }
                    button={
                        <button 
                            className={clsx(
                                styles["search-item-button"],
                                savedAlbums.findIndex(({ album }) => album.id === item.id) !== -1 && styles["active"]   
                            )}
                            onClick={async (e) => await toggleLibraryItem(e, item.id, item.type)}
                        >
                            <CheckFilled width={40} height={40} />
                            <AddIcon width={40} height={40} />
                        </button>
                    }
                />
            )
        }
    }

    const renderArtists = (items: IArtist[]) => {
        if (items.length > 0 && (activeTab === "All" || activeTab === "Artists")) {
            return items.map((item) => 
                item &&
                <SearchItem 
                    key={item.id}
                    type={item.type}
                    link={`/artists/${item.id}`}
                    image={item.images?.[0]?.url ?? ""}
                    content={
                        <>
                            <Paragraph className={styles["search-item-name"]}>
                            {item.name}
                            </Paragraph>
                            <Paragraph className={styles["search-item-type"]}>
                                {item.type}
                            </Paragraph>
                        </>
                    }
                    button={
                        <OutlinedButton onClick={async (e) => await toggleLibraryItem(e, item.id, item.type)}>
                            <Description className={styles["search-item-button-text"]}>
                                {savedArtists.findIndex(artist => artist.id === item.id) !== -1 ?
                                "Unfollow" :
                                "Follow"}
                            </Description>
                        </OutlinedButton>
                    }
                />
            )
        }
    }

    const renderPlaylists = (items: ISimplifiedPlaylist[]) => {
        if (items.length > 0 && (activeTab === "All" || activeTab === "Playlists")) {
            return items.map(item =>
                item &&
                <SearchItem 
                    key={item.id}
                    type={item.type}
                    link={`/playlists/${item.id}`}
                    image={item.images?.[0].url ?? ""}
                    content={
                        <>
                            <Paragraph className={styles["search-item-name"]}>
                                {item.name}
                            </Paragraph>
                            <Paragraph className={styles["search-item-type"]}>
                                {item.type}
                            </Paragraph>
                        </>
                    }
                    button={
                        <button 
                            className={clsx(
                                styles["search-item-button"],
                                savedPlaylists.findIndex(playlist => playlist.id === item.id) !== -1 && styles["active"]   
                            )}
                            onClick={async (e) => await toggleLibraryItem(e, item.id, item.type)}
                        >
                            <CheckFilled width={40} height={40} />
                            <AddIcon width={40} height={40} />
                        </button>
                    }
                /> 
            )
        }
    }

    const renderShows = (items: ISimplifiedShow[]) => {
        if (items.length > 0 && (activeTab === "All" || activeTab === "Shows")) {
            return items.map((item) => 
                item &&
                <SearchItem 
                    key={item.id}
                    type={item.type}
                    link={`/shows/${item.id}`}
                    image={item.images?.[0].url ?? ""}
                    content={
                        <>
                            <Paragraph className={styles["search-item-name"]}>
                                {item.name}
                            </Paragraph>
                            <div className={styles["search-item-content"]}>
                                <Paragraph className={styles["search-item-type"]}>
                                    {item.type}
                                </Paragraph>
                                <Paragraph>
                                    &#183;
                                </Paragraph>
                                <Paragraph className={styles["search-item-publisher"]}>
                                    {item.publisher}
                                </Paragraph>
                            </div>
                        </>
                    }
                    button={
                        <button 
                            className={clsx(
                                styles["search-item-button"],
                                savedShows.findIndex(({ show }) => show.id === item.id) !== -1 && styles["active"]   
                            )}
                            onClick={async (e) => await toggleLibraryItem(e, item.id, item.type)}
                        >
                            <CheckFilled width={40} height={40} />
                            <AddIcon width={40} height={40} />
                        </button>
                    }
                /> 
            )
        }
    }

    const renderEpisodes = (items: ISimplifiedEpisode[]) => {
        if (items.length > 0 && (activeTab === "All" || activeTab === "Songs")) {
            return items.map((item) => 
                item &&
                <SearchItem 
                    key={item.id}
                    type={item.type}
                    link={`/episodes/${item.id}`}
                    image={item.images?.[0].url ?? ""}
                    content={
                        <>
                            <Paragraph className={styles["search-item-name"]}>
                                {item.name ?? ""}
                            </Paragraph>
                            <Description className={styles["search-item-type"]}>
                                {item.type}
                            </Description>
                        </>
                    }
                    button={
                        <button 
                            className={clsx(
                                styles["search-item-button"],
                                savedTracks.findIndex(({ track }) => track.id === item.id) !== -1 && styles["active"]   
                            )}
                            onClick={async (e) => await toggleLibraryItem(e, item.id, item.type)}
                        >
                            <CheckFilled width={40} height={40} />
                            <AddIcon width={40} height={40} />
                        </button>
                    }
                /> 
            )
        }
    }

    return (
        <div className={styles["search-results"]}>
            <CategoryTabs<TSearchFilter> 
                tabs={tabs}
                activeTab={activeTab}
                chooseTab={chooseTab}
                className={theme}
            />
            <div className={styles["search-container"]}>
                {renderTracks(search.tracks ?? [])}
                {renderArtists(search.artists ?? [])}
                {renderAlbums(search.albums ?? [])}
                {renderPlaylists(search.playlists ?? [])}
                {renderEpisodes(search.episodes ?? [])}
                {renderShows(search.shows ?? [])}
            </div>
        </div>
    )
}