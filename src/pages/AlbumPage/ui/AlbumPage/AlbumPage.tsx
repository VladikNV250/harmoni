import { 
    ChangeEvent,
    CSSProperties, 
    FC, 
    useCallback, 
    useEffect, 
    useState 
} from "react";
import { 
    fetchAlbum, 
    IAlbum 
} from "shared/api/album";
import { 
    useNavigate,
    useParams 
} from "react-router";
import { 
    displayDate, 
    useAppDispatch, 
    useAppSelector, 
    useColor, 
    useDebounce
} from "shared/lib";
import { 
    Description, 
    Loader, 
    SearchInput, 
    Title 
} from "shared/ui";
import { 
    getUserInfo, 
    selectUser, 
    selectUserLoading 
} from "entities/user";
import { 
    ArrowLeft, 
    PlaceholderImage 
} from "shared/assets";
import { 
    getLibraryAlbums, 
    getLibraryPlaylists, 
    selectLibraryLoading,
} from "features/library";
import { TrackItem } from "entities/track";
import { ISimplifiedTrack } from "shared/api/track";
import { ArtistList } from "entities/artist";
import { usePlaybackAdapter } from "entities/playback";
import { AlbumControlPanel } from "../AlbumControlPanel/AlbumControlPanel";
import { fetchPlaybackState } from "entities/playback/api/playback";
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
                return tracks.map(track => {
                    const lowerName = track.name?.toLowerCase();
                    const lowerValue = (debouncedValue as string).toLowerCase();
                    const isMatch = lowerName?.includes(lowerValue);
                    return isMatch && (
                        <TrackItem 
                            key={track.id} 
                            track={track} 
                            defaultAlbum={album}
                            contextUri={album.uri}
                        />
                    )
                })
            } else {
                return tracks.map(track => {
                    return (
                        <TrackItem 
                            key={track.id} 
                            track={track} 
                            defaultAlbum={album}
                            contextUri={album.uri}
                        />
                    )
                })
            }
        }
    }, [debouncedValue, album]);

    return (
        <div 
            className={styles["album"]} 
            style={{'--color': color} as CSSProperties}>
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
                    className={styles["header-input"]} 
                />
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
            <AlbumControlPanel album={album} />
            <div className={styles["album-items-container"]}>
                {renderTracks(album?.tracks.items ?? [])}
            </div>
        </div>
    )
}

export default AlbumPage;