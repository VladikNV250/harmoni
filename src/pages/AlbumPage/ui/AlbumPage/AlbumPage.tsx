import {
    ChangeEvent,
    CSSProperties,
    FC,
    useCallback,
    useEffect,
    useState
} from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router";
import {
    getLibraryAlbums,
    getLibraryPlaylists,
    selectLibraryLoading,
} from "features/library";
import { TrackItem } from "features/track";
import {
    getUserInfo,
    selectUser,
    selectUserLoading
} from "entities/user";
import { ArtistList } from "entities/artist";
import { 
    fetchPlaybackState, 
    usePlaybackAdapter 
} from "entities/playback";
import {
    fetchAlbum,
    IAlbum
} from "shared/api/album";
import {
    calculateDuration,
    displayDate,
    useAppDispatch,
    useAppSelector,
    useColor,
    useDebounce
} from "shared/lib";
import {
    Description,
    DesktopTitle,
    ExpandableSearchInput,
    Loader,
    Paragraph,
    SearchInput,
    Title
} from "shared/ui";
import {
    ArrowLeft,
    ArtistIcon,
    PlaceholderImage
} from "shared/assets";
import { ISimplifiedTrack } from "shared/api/track";
import { AlbumControlPanel } from "../AlbumControlPanel/AlbumControlPanel";
import styles from "./style.module.scss";


const AlbumPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [album, setAlbum] = useState<IAlbum | null>(null);
    const [albumLoading, setAlbumLoading] = useState<boolean>(false);
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 300);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);
    const color = useColor(album?.images[0]?.url ?? PlaceholderImage);
    const { setApiPlayback } = usePlaybackAdapter();

    /** Loading album data, update library and playback on page load. */
    useEffect(() => {
        (async () => {
            try {
                setAlbumLoading(true);
                if (id) setAlbum(await fetchAlbum(id));

                dispatch(getLibraryAlbums());
                dispatch(getLibraryPlaylists());
                setApiPlayback?.(await fetchPlaybackState());
            } catch (e) {
                console.error(e);
            } finally {
                setAlbumLoading(false);
            }
        })()
    }, [id, setApiPlayback, dispatch])

    useEffect(() => {
        if (user === null) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(value);
    }

    const renderTracks = useCallback((tracks: ISimplifiedTrack[]) => {
        if (tracks.length > 0 && album) {
            if (debouncedValue) {
                return tracks.map((track, index) => {
                    const lowerName = track.name?.toLowerCase();
                    const lowerValue = (debouncedValue as string).toLowerCase();
                    const isMatch = lowerName?.includes(lowerValue);
                    return isMatch && (
                        <TrackItem
                            key={track.id}
                            track={track}
                            sequenceNumber={index + 1}
                            showAlbum={false}
                            showImage={false}
                            defaultAlbum={album}
                            contextUri={album.uri}
                        />
                    )
                })
            } else {
                return tracks.map((track, index) => {
                    return (
                        <TrackItem
                            key={track.id}
                            track={track}
                            sequenceNumber={index + 1}
                            showAlbum={false}
                            showImage={false}
                            defaultAlbum={album}
                            contextUri={album.uri}
                        />
                    )
                })
            }
        }
    }, [debouncedValue, album]);

    const calculateTotalDuration = () => {
        let totalDuration = 0;
        album?.tracks.items.map(item => totalDuration += item?.duration_ms ?? 0);

        return calculateDuration(totalDuration, "word");
    }

    const renderDesktopArtists = () => {
        return (album?.artists.length ?? 0) > 0 && album?.artists.map(item =>
            <div key={item.id} className={styles["album-artist__desktop"]}>
                <Link
                    to={`/artists/${item.id}`}
                    className={styles["album-artist-link"]}
                >
                    <ArtistIcon width={60} height={60} />
                    <Paragraph className={styles["album-artist-name"]}>
                        {item.name ?? ""}
                    </Paragraph>
                </Link>
            </div>
        )
    }

    return (
        <div
            className={styles["album"]}
            style={{ '--color': color } as CSSProperties}>
            <Loader loading={albumLoading || libraryLoading || userLoading} />
            <header className={styles["album-header"]}>
                <button
                    className={styles["header-button"]}
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft width={40} height={40} />
                </button>
                <SearchInput
                    value={value}
                    onChange={handleChange}
                    placeholder={"Find in album"}
                    className={styles["album-search"]}
                />
            </header>
            <div className={styles["album-image-container"]}>
                <img
                    src={album?.images[0].url || PlaceholderImage}
                    className={styles["album-image"]}
                />
                <div className={styles["album-artists-list__desktop"]}>
                    {renderDesktopArtists()}
                </div>
            </div>
            <div className={styles["album-content"]}>
                <Title className={styles["album-name"]}>
                    {album?.name ?? ""}
                </Title>
                <DesktopTitle className={styles["album-name__desktop"]}>
                    {album?.name ?? ""}
                </DesktopTitle>
                <div className={styles["album-info-container"]}>
                    <div className={styles["album-artists-list"]}>
                        <ArtistList
                            artists={album?.artists}
                            className={styles["album-artists"]}
                        />
                    </div>
                    <Description className={styles["album-type"]}>
                        {album?.album_type ?? ""}
                    </Description>
                    <Description>
                        {(album?.total_tracks ?? 0) > 0 ? album?.total_tracks + " Songs" : ""}
                    </Description>
                    <Description>
                        {calculateTotalDuration()}
                    </Description>
                    <Description>
                        {displayDate(album?.release_date, album?.release_date_precision)}
                    </Description>
                </div>
                <div className={styles["control-panel-container"]}>
                    <AlbumControlPanel album={album} />
                    <ExpandableSearchInput
                        className={styles["album-search__desktop"]}
                        value={value}
                        onChange={handleChange}
                        placeholder={"Find in album"}
                        direction="left"
                    />
                </div>
                <header className={styles["album-items-header"]}>
                    <Description className={styles["sequence-number"]}>
                        #
                    </Description>
                    <div className={styles["gap"]} />
                    <Description className={styles["title"]}>
                        Title
                    </Description>
                    <div className={styles["gap"]} />
                    <Description className={styles["duration"]}>
                        Duration
                    </Description>
                    <div className={styles["gap-button"]} />
                </header>
                <div className={styles["album-items-body"]}>
                    {renderTracks(album?.tracks.items ?? [])}
                </div>
            </div>
        </div>
    )
}

export default AlbumPage;