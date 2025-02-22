import { CSSProperties, FC, useEffect, useState } from "react";
import { fetchAlbum, IAlbum } from "shared/api/album";
import { useParams } from "react-router";
import { displayDate, useColor } from "shared/lib";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { Description, Input, Loader, Title } from "shared/ui";
import { TrackItem } from "entities/track";
import { ISimplifiedTrack } from "shared/api/track";
import { ArtistList } from "entities/artist";
import './AlbumPage.scss';
import { PagePlaybackControl } from "entities/playback";

const AlbumPage: FC = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState<IAlbum | null>(null);
    const [loading, setLoading] = useState(false);
    const color = useColor(album?.images[0]?.url ?? PlaceholderImage);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (id) setAlbum(await fetchAlbum(id));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })()
    }, [id])

    const renderTracks = (tracks: ISimplifiedTrack[]) => {
        return (tracks.length > 0 && album) && tracks.map(track =>
            <TrackItem 
                key={track.id} 
                track={track} 
                defaultAlbum={album}
                contextUri={album.uri}
            />
        )
    }

    return (
        <div className="album-page" style={{'--color': color} as CSSProperties}>
            <Loader loading={loading} />
            <header className="album-header">
                <Input placeholder="Find in album" />
            </header>
            <div className="album-image-container">
                <img 
                    src={album?.images[0].url || PlaceholderImage} 
                    className="album-image" 
                />
            </div>
            <Title className="album-name">{album?.name ?? ""}</Title>
            <div className="album-info-container">
                <ArtistList 
                    artists={album?.artists} 
                    className="album-artist"
                />
                <p className="dot">&#183;</p>
                <Description className="album-type">
                    {album?.album_type ?? ""}
                </Description>
                <p className="dot">&#183;</p>
                <Description className="album-date">
                    {displayDate(album?.release_date, album?.release_date_precision)}
                </Description>
            </div>
            <PagePlaybackControl 
                contextUri={album?.uri}
            />
            <div className="album-items-container">
                {renderTracks(album?.tracks.items ?? [])}
            </div>
        </div>
    )
}

export default AlbumPage;