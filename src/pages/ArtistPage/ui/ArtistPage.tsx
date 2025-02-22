import { CSSProperties, FC, useEffect, useState } from "react";
import { fetchArtist, fetchArtistAlbums, fetchArtistTopTracks, IArtist } from "shared/api/artist";
import { useParams } from "react-router";
import { useColor } from "shared/lib";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { Description, Loader, Tabs, Title } from "shared/ui";
import { ITrack } from "shared/api/track";
import { ISimplifiedAlbum } from "shared/api/album";
import { AlbumPreview } from "entities/album";
import { TrackItem } from "entities/track";
import { PagePlaybackControl } from "entities/playback";
import './ArtistPage.scss';

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
    const [currentTab, setCurrentTab] = useState("Top Tracks");
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
        <div className="artist-page" style={{'--color': color} as CSSProperties}>
            <Loader loading={loading} />
            <div className="artist-image-container">
                <img 
                    src={artist?.images[0].url || PlaceholderImage} 
                    className="artist-image" 
                />
                <div className="artist-body">
                    <Title className="artist-name">{artist?.name ?? ""}</Title>
                    <Description className="artist-total">
                        {displayFollowers(artist?.followers.total)}
                    </Description>
                </div>
            </div>
            <PagePlaybackControl 
                className="artist-control-panel" 
                contextUri={artist?.uri}
            />
            <Tabs 
                tabs={tabs}
                currTab={currentTab}
                setTab={setCurrentTab}
                className="artist-tabs"
            />
            <div className="artist-content">
                
                {currentTab === "Top Tracks" &&
                <div className="artist-items-container">
                    {renderTracks(tracks ?? [])}
                </div>}
                
                {currentTab === "Albums" &&
                <div className="artist-albums-container">
                    {renderAlbums(albums.album ?? [])}
                </div>}

                {currentTab === "Singles" &&
                <div className="artist-albums-container">
                    {renderAlbums(albums.single ?? [])}
                </div>
                }
                {currentTab === "Compilations and Appears On" &&
                <div className="artist-albums-container">
                    {renderAlbums(albums.compilation ?? [])}
                </div>}
            </div>
        </div>
    )
}

export default ArtistPage;