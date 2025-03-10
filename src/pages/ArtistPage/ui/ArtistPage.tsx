import { CSSProperties, FC, useEffect, useState } from "react";
import { fetchArtist, fetchArtistAlbums, fetchArtistTopTracks, IArtist } from "shared/api/artist";
import { useParams } from "react-router";
import { useColor, useTabs } from "shared/lib";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { Description, Loader, NavigationTabs, Title } from "shared/ui";
import { ITrack } from "shared/api/track";
import { ISimplifiedAlbum } from "shared/api/album";
import { AlbumPreview } from "entities/album";
import { TrackItem } from "entities/track";
import { PagePlaybackControl } from "entities/playback";
import styles from "./style.module.scss";

const ArtistPage: FC = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState<IArtist | null>(null);
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [albums, setAlbums] = useState<{[key: string]: ISimplifiedAlbum[]}>({
        "album": [],
        "single": [],
        "compilation": [],
    });
    const [loading, setLoading] = useState(false);
    const [tabs, setTabs] = useState<string[]>([]);
    const { activeTab, chooseTab } = useTabs<string, "Top Tracks">("Top Tracks");
    const color = useColor(artist?.images[0]?.url ?? PlaceholderImage);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (id) {
                    setArtist(await fetchArtist(id));
                    
                    const tracks = (await fetchArtistTopTracks(id)).tracks;
                    const albums = (await fetchArtistAlbums(id, {include_groups: "album"})).items;
                    const singles = (await fetchArtistAlbums(id, {include_groups: "single"})).items;
                    const compilations = (await fetchArtistAlbums(id, {include_groups: "compilation,appears_on"})).items;

                    if (tracks.length > 0) {
                        setTracks(tracks);
                        setTabs(tabs => [...tabs, "Top Tracks"]);
                    }
                    if (albums.length > 0) {
                        setAlbums(prevState => ({
                            ...prevState,
                            "album": albums
                        }));
                        setTabs(tabs => Array.from(new Set([...tabs, "Albums"])));
                    }
                    if (singles.length > 0) {
                        setAlbums(prevState => ({
                            ...prevState,
                            "single": singles,
                        }));
                        setTabs(tabs => Array.from(new Set([...tabs, "Singles"])));
                    }
                    if (compilations.length > 0) {
                        setAlbums(prevState => ({
                            ...prevState,
                            "compilation": compilations,
                        }));
                        setTabs(tabs => Array.from(new Set([...tabs, "Compilations and Appears On"])));
                    }
                } 
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })()

        return () => setTabs([]);
    }, [id])

    const displayFollowers = (followers: number = 0): string => {
        if (followers === 0) return "";

        const formatter = Intl.NumberFormat("en");
        return formatter.format(followers) + " followers";
    }

    const renderTracks = (tracks: ITrack[]) => {
        return tracks.length > 0 && tracks.map((track) =>
            <TrackItem 
                key={track.id}
                track={track}
            />
        )
    }

    const renderAlbums = (albums: ISimplifiedAlbum[]) => {
        return albums.length > 0 && albums.map(album =>
            <AlbumPreview 
                key={album.id}
                album={album} 
                description="date-year"
            />
        )
    }

    return (
        <div 
            className={styles["artist"]} 
            style={{'--color': color} as CSSProperties}>
            <Loader loading={loading} />
            <div className={styles["artist-image-container"]}>
                <img 
                    src={artist?.images[0].url || PlaceholderImage} 
                    className={styles["artist-image"]} 
                />
                <div className={styles["artist-body"]}>
                    <Title className={styles["artist-name"]}>
                        {artist?.name ?? ""}
                    </Title>
                    <Description className={styles["artist-total"]}>
                        {displayFollowers(artist?.followers.total)}
                    </Description>
                </div>
            </div>
            <PagePlaybackControl 
                className={styles["artist-control-panel"]} 
                contextUri={artist?.uri}
            />
            <NavigationTabs
                tabs={tabs}
                activeTab={activeTab}
                chooseTab={chooseTab}
                className={styles["artist-tabs"]}
            />
            <div className={styles["artist-content"]}>
                {activeTab === "Top Tracks" &&
                <div className={styles["artist-items-container"]}>
                    {renderTracks(tracks ?? [])}
                </div>}
                {activeTab === "Albums" &&
                <div className={styles["artist-albums-container"]}>
                    {renderAlbums(albums.album ?? [])}
                </div>}
                {activeTab === "Singles" &&
                <div className={styles["artist-albums-container"]}>
                    {renderAlbums(albums.single ?? [])}
                </div>}
                {activeTab === "Compilations and Appears On" &&
                <div className={styles["artist-albums-container"]}>
                    {renderAlbums(albums.compilation ?? [])}
                </div>}
            </div>
        </div>
    )
}

export default ArtistPage;