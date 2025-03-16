import { CSSProperties, FC, useEffect, useState } from "react";
import { fetchAlbum, IAlbum } from "shared/api/album";
import { useParams } from "react-router";
import { displayDate, useAppDispatch, useAppSelector, useColor } from "shared/lib";
import { Description, Loader, SearchInput, Title } from "shared/ui";
import { TrackItem } from "entities/track";
import { ISimplifiedTrack } from "shared/api/track";
import { ArtistList } from "entities/artist";
import { PagePlaybackControl, usePlaybackAdapter } from "entities/playback";
import { fetchPlaybackState } from "entities/playback/api/playback";
import { getUserInfo, selectUser, selectUserLoading } from "entities/user";
import { PlaceholderImage } from "shared/assets";
import styles from "./style.module.scss";

const AlbumPage: FC = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState<IAlbum | null>(null);
    const [albumLoading, setAlbumLoading] = useState(false);
    const color = useColor(album?.images[0]?.url ?? PlaceholderImage);
    const { setApiPlayback } = usePlaybackAdapter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);

    useEffect(() => {
        (async () => {
            try {
                setAlbumLoading(true);
                if (id) setAlbum(await fetchAlbum(id));
                setApiPlayback?.(await fetchPlaybackState());
            } catch (e) {
                console.error(e);
            } finally {
                setAlbumLoading(false);
            }
        })()
    }, [id, setApiPlayback])

    useEffect(() => {
        if (user === null) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user])

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
        <div 
            className={styles["album"]} 
            style={{'--color': color} as CSSProperties}>
            <Loader loading={albumLoading || userLoading} />
            <header className={styles["album-header"]}>
                <SearchInput placeholder={"Find in album"} />
            </header>
            <div className={styles["album-image-container"]}>
                <img 
                    src={album?.images[0].url || PlaceholderImage} 
                    className={styles["album-image"]} 
                />
            </div>
            <Title className={styles["album-name"]}>{album?.name ?? ""}</Title>
            <div className={styles["album-info-container"]}>
                <ArtistList 
                    artists={album?.artists} 
                    className={styles["album-artist"]}
                />
                <p className={styles["dot"]}>&#183;</p>
                <Description className={styles["album-type"]}>
                    {album?.album_type ?? ""}
                </Description>
                <p className={styles["dot"]}>&#183;</p>
                <Description>
                    {displayDate(album?.release_date, album?.release_date_precision)}
                </Description>
            </div>
            <PagePlaybackControl 
                contextUri={album?.uri}
            />
            <div className={styles["album-items-container"]}>
                {renderTracks(album?.tracks.items ?? [])}
            </div>
        </div>
    )
}

export default AlbumPage;