import { CSSProperties, FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchPlaylist, IPlaylist } from "shared/api/playlist";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { Description, Loader, SearchInput, Title } from "shared/ui";
import { calculateDuration, useColor } from "shared/lib";
import { TrackItem } from "entities/track";
import { EpisodeItem } from "entities/episode";
import { PagePlaybackControl } from "entities/playback";
import styles from "./style.module.scss";
import { Sort } from "shared/assets";


const PlaylistPage: FC = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState<IPlaylist | null>(null);
    const [loading, setLoading] = useState(false);
    const color = useColor(playlist?.images?.[0]?.url ?? PlaceholderImage);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (id) {
                    setPlaylist(await fetchPlaylist(id));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })()
    }, [id])

    const calculateTracksDuration = (tracks?: IPlaylist["tracks"]["items"]): string => {
        let total_duration = 0;
        tracks?.forEach(({ track }) => {
            total_duration += track.duration_ms;
        })

        return calculateDuration(total_duration);
    }

    const renderPlaylistTracks = (tracks: IPlaylist["tracks"]["items"]) => {
        return tracks.length > 0 && tracks.map(({ track }) =>
            track.type === "track" ?
                <TrackItem 
                    key={track.id} 
                    track={track} 
                    contextUri={playlist?.uri} 
                /> :
            track.type === "episode" ? 
                <EpisodeItem 
                    key={track.id} 
                    episode={track} 
                    showURI={track?.show?.uri ?? ""} 
                /> 
            : null
        )
    }

    return (
        <div className={styles["playlist"]} style={{'--color': color} as CSSProperties}>
            <Loader loading={loading} />
            <header className={styles["playlist-header"]}>
                <SearchInput 
                    placeholder="Search playlist" 
                    className={styles["header-input"]} 
                />
                <button className={styles["header-button"]}>
                    <Sort width={40} height={40} />
                </button>   
            </header>
            <div className={styles["playlist-image-container"]}>
                <img 
                    src={playlist?.images?.[0].url || PlaceholderImage} 
                    className={styles["playlist-image"]} 
                />
            </div>
            <Title className={styles["playlist-name"]}>{playlist?.name ?? ""}</Title>
            <div className={styles["playlist-description-container"]}>
                <Description className={styles["playlist-description"]}>By</Description>
                <Link to={`/profile/${playlist?.owner.id}`} className={styles["playlist-owner"]}>
                    {playlist?.owner.display_name ?? ""}
                </Link>
                {(playlist?.tracks.total ?? 0) > 0
                ?
                <>
                    <p className="dot">&#183;</p>
                    <Description className={styles["playlist-description"]}>
                        {`${playlist?.tracks.total} Songs`}
                    </Description>
                    <p className="dot">&#183;</p>
                    <Description className={styles["playlist-description"]}>
                        {calculateTracksDuration(playlist?.tracks.items)}
                    </Description>
                </>
                : null
                }
            </div>
            <PagePlaybackControl 
                contextUri={playlist?.uri} 
            />
            <div className={styles["playlist-items-container"]}>
                {renderPlaylistTracks(playlist?.tracks.items ?? [])}
            </div>
        </div>
    )
}

export default PlaylistPage;