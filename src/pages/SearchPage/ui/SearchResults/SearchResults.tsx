import {
    FC,
    useMemo,
} from "react";
import {
    selectSearch,
    TSearchFilter
} from "features/search";
import { TrackItem } from "features/track";
import { useTheme } from "entities/theme";
import { AlbumPreview } from "entities/album";
import { ArtistPreview } from "entities/artist";
import { PlaylistPreview } from "entities/playlist";
import { EpisodePreview } from "entities/episode";
import { ShowPreview } from "entities/show";
import {
    useAppSelector,
    useTabs,
    useWindowDimensions
} from "shared/lib";
import {
    CategoryTabs,
    Title
} from "shared/ui";
import { SearchItem } from "../SearchItem/SearchItem";
import styles from "./style.module.scss";


/**
 * @component SearchResults
 * @description Component responsible for rendering search results grouped by content type 
 * (tracks, albums, artists, playlists, shows, episodes), supporting category tabs and responsive 
 * layout. Displays compact previews for mobile and detailed components for desktop.
 */
export const SearchResults: FC = () => {
    const search = useAppSelector(selectSearch);
    const tabs: TSearchFilter[] = ["All", "Songs", "Albums", "Artists", "Playlists", "Podcasts"];
    const { theme } = useTheme();
    const { activeTab, chooseTab } = useTabs<TSearchFilter, "All">("All");
    const { width } = useWindowDimensions();

    const isDesktop = useMemo(
        () => width >= 768, [width]
    );

    const renderTracks = (limit: number = search.tracks.length) => {
        if (search.tracks.length > 0) {
            return search.tracks.filter(item => item).map((item, index) =>
                index < limit &&
                (isDesktop
                    ?
                    <TrackItem
                        key={item.id}
                        track={item}
                        sequenceNumber={index + 1}
                        showAlbum
                        showImage={false}
                    />
                    :
                    <SearchItem
                        key={item.id}
                        item={item}
                        artists={item.artists}
                    />
                )
            )
        }
    }

    const renderAlbums = () => {
        if (search.albums.length > 0) {
            return search.albums.filter(item => item).map(item =>
                isDesktop
                    ?
                    <AlbumPreview
                        key={item.id}
                        album={item}
                    />
                    :
                    <SearchItem
                        key={item.id}
                        item={item}
                        artists={item.artists}
                    />
            )
        }
    }

    const renderArtists = () => {
        if (search.artists.length > 0) {
            return search.artists.filter(item => item).map(item =>
                isDesktop
                    ?
                    <ArtistPreview
                        key={item.id}
                        artist={item}
                    />
                    :
                    <SearchItem
                        key={item.id}
                        item={item}
                    />
            )
        }
    }

    const renderPlaylists = () => {
        if (search.playlists.length > 0) {
            return search.playlists.filter(item => item).map(item =>
                isDesktop
                    ?
                    <PlaylistPreview
                        key={item.id}
                        playlist={item}
                    />
                    :
                    <SearchItem
                        key={item.id}
                        item={item}
                    />
            )
        }
    }

    const renderEpisodes = () => {
        if (search.episodes.length > 0) {
            return search.episodes.filter(item => item).map(item =>
                isDesktop
                    ?
                    <EpisodePreview
                        key={item.id}
                        episode={item}
                    />
                    :
                    <SearchItem
                        key={item.id}
                        item={item}
                    />
            )
        }
    }

    const renderShows = () => {
        if (search.shows.length > 0) {
            return search.shows.filter(item => item).map(item =>
                isDesktop
                    ?
                    <ShowPreview
                        key={item.id}
                        show={item}
                    />
                    :
                    <SearchItem
                        key={item.id}
                        item={item}
                        publisher={item.publisher}
                    />
            )
        }
    }

    const renderAll = () => {
        return (
            <>
                <header className={styles["search-header"]}>
                    {renderTracks(4)}
                </header>
                <div className={styles["search-category"]}>
                    <Title>Artists</Title>
                    <div className={styles["category-items"]}>
                        {renderArtists()}
                    </div>
                </div>
                <div className={styles["search-category"]}>
                    <Title>Albums</Title>
                    <div className={styles["category-items"]}>
                        {renderAlbums()}
                    </div>
                </div>
                <div className={styles["search-category"]}>
                    <Title>Playlists</Title>
                    <div className={styles["category-items"]}>
                        {renderPlaylists()}
                    </div>
                </div>
                <div className={styles["search-category"]}>
                    <Title>Episodes</Title>
                    <div className={styles["category-items"]}>
                        {renderEpisodes()}
                    </div>
                </div>
                <div className={styles["search-category"]}>
                    <Title>Podcasts</Title>
                    <div className={styles["category-items"]}>
                        {renderShows()}
                    </div>
                </div>
            </>
        )
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
                {isDesktop
                    ?
                    activeTab === "All" ? renderAll() :
                        activeTab === "Songs" ? renderTracks() :
                            <div className={styles["search-grid-container"]}>
                                {activeTab === "Artists" && renderArtists()}
                                {activeTab === "Albums" && renderAlbums()}
                                {activeTab === "Playlists" && renderPlaylists()}
                                {activeTab === "Podcasts" && renderShows()}
                            </div>
                    :
                    <>
                        {(activeTab === "All" || activeTab === "Songs") && renderTracks()}
                        {(activeTab === "All" || activeTab === "Artists") && renderArtists()}
                        {(activeTab === "All" || activeTab === "Albums") && renderAlbums()}
                        {(activeTab === "All" || activeTab === "Playlists") && renderPlaylists()}
                        {(activeTab === "All" || activeTab === "Songs") && renderEpisodes()}
                        {(activeTab === "All" || activeTab === "Podcasts") && renderShows()}
                    </>
                }
            </div>
        </div>
    )
}