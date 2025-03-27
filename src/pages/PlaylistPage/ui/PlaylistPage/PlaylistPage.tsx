import { 
    ChangeEvent,
    CSSProperties, 
    FC, 
    useCallback, 
    useEffect, 
    useMemo, 
    useState 
} from "react";
import { 
    Link, 
    useNavigate, 
    useParams 
} from "react-router";
import { 
    fetchPlaylist, 
    IPlaylist, 
} from "shared/api/playlist";
import { 
    Description, 
    Loader, 
    SearchInput, 
    Title 
} from "shared/ui";
import { 
    calculateDuration, 
    useAppDispatch, 
    useAppSelector, 
    useColor, 
    useDebounce
} from "shared/lib";
import { TrackItem } from "entities/track";
import { PlaylistEpisodeItem } from "entities/episode";
import { usePlaybackAdapter } from "entities/playback";
import { 
    ArrowLeft,
    PlaceholderImage, 
    Sort 
} from "shared/assets";
import { 
    getUserInfo, 
    selectUser, 
    selectUserLoading 
} from "entities/user";
import { 
    getLibraryPlaylists, 
    selectLibraryLoading, 
} from "features/library";
import { fetchPlaybackState } from "entities/playback/api/playback";
import { PlaylistControlPanel } from "../PlaylistControlPanel/PlaylistControlPanel";
import { 
    SortMenu,
    TRACK_SORT_TYPES, 
    TSortOrder, 
    TTrackSortBy
} from "features/sort";
import styles from "./style.module.scss";


const PlaylistPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState<IPlaylist | null>(null);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const userLoading = useAppSelector(selectUserLoading);
    const user = useAppSelector(selectUser);
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 300);
    const color = useColor(playlist?.images?.[0]?.url ?? PlaceholderImage);
    const { setApiPlayback } = usePlaybackAdapter();
    const [sort, setSort] = useState<{
        isOpen: boolean,
        by: TTrackSortBy,
        order: TSortOrder
    }>({
        isOpen: false,
        by: "Custom order",
        order: "Ascending"
    });

    const isUserOwner = useMemo(
        () => playlist?.owner.id === user?.id,
        [user, playlist]
    )

    useEffect(() => {
        (async () => {
            try {
                setPlaylistLoading(true);
                if (id) {
                    setPlaylist(await fetchPlaylist(id));
                }

                setApiPlayback?.(await fetchPlaybackState());
                dispatch(getUserInfo());
                dispatch(getLibraryPlaylists());
            } catch (e) {
                console.error(e);
            } finally {
                setPlaylistLoading(false);
            }
        })()
    }, [id, setApiPlayback, dispatch]);

    const calculateTracksDuration = (tracks?: IPlaylist["tracks"]["items"]): string => {
        let total_duration = 0;
        tracks?.forEach(({ track }) => {
            total_duration += track.duration_ms;
        })

        return calculateDuration(total_duration);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(value);
    }

    const sortTracks = useCallback((tracks: IPlaylist["tracks"]["items"]): IPlaylist["tracks"]['items'] => {
        let sortedTracks = tracks;

        switch (sort.by) {
            case "Alphabetical":
                sortedTracks = tracks.sort((a, b) => {
                    if (a.track.name < b.track.name) {
                        return -1;
                    } else if (a.track.name > b.track.name) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                break;
            case "Duration":
                sortedTracks = tracks.sort((a, b) => 
                    a.track.duration_ms - b.track.duration_ms
                )
                break;
            case "Date added":
                sortedTracks = tracks.sort((a, b) => {
                    if ((a.added_at ?? "") < (b.added_at ?? "")) {
                        return -1;
                    } else if ((a.added_at ?? "") > (b.added_at ?? "")) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                break;
        }

        if (sort.order === "Descending") {
            return sortedTracks.reverse();
        } else {
            return sortedTracks;
        }
    }, [sort.by, sort.order])

    const renderPlaylistTracks = useCallback((tracks: IPlaylist["tracks"]["items"]) => {
        const sortedTracks = sortTracks(tracks);

        if (sortedTracks.length > 0) {
            if (debouncedValue) {
                return sortedTracks.map(({ track }) => {
                    const lowerName = track.name?.toLowerCase();
                    const lowerValue = (debouncedValue as string).toLowerCase();
                    const isMatch = lowerName?.includes(lowerValue);
                    return isMatch && (
                        track.type === "track" ?
                            <TrackItem 
                                key={track.id} 
                                track={track} 
                                contextUri={playlist?.uri} 
                                playlistId={isUserOwner ? playlist?.id : ""}
                            /> :
                        track.type === "episode" ? 
                            <PlaylistEpisodeItem
                                key={track.id}
                                episode={track}
                                playlistId={isUserOwner ? playlist?.id : ""}
                            />
                        : null
                    )
                })
            } else {
                return sortedTracks.map(({ track }) =>
                    track.type === "track" ?
                        <TrackItem 
                            key={track.id} 
                            track={track} 
                            contextUri={playlist?.uri} 
                            playlistId={isUserOwner ? playlist?.id : ""}
                        /> :
                    track.type === "episode" ? 
                        <PlaylistEpisodeItem
                            key={track.id}
                            episode={track}
                            playlistId={isUserOwner ? playlist?.id : ""}
                        />
                    : null
                )
            }
        }
    }, [debouncedValue, playlist?.id, playlist?.uri, sortTracks])

    return (
        <div className={styles["playlist"]} style={{'--color': color} as CSSProperties}>
            <Loader loading={playlistLoading || libraryLoading || userLoading} />
            <SortMenu<TTrackSortBy>
                sort={sort}
                setSort={setSort}
                sortTypes={TRACK_SORT_TYPES}
            />
            <header className={styles["playlist-header"]}>
                <button 
                    className={styles["header-button"]}
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft width={40} height={40} />
                </button>
                <SearchInput 
                    value={value}
                    onChange={handleChange}
                    placeholder="Search playlist" 
                    className={styles["header-input"]} 
                />
                <button 
                    className={styles["header-button"]}
                    onClick={() => setSort(prevState => ({...prevState, isOpen: true}))}
                >
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
                <Link 
                    to={`/profile/${playlist?.owner.id}`} 
                    className={styles["playlist-owner"]}
                >
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
            <PlaylistControlPanel playlist={playlist} />
            <div className={styles["playlist-items-container"]}>
                {renderPlaylistTracks(playlist?.tracks.items ?? [])}
            </div>
        </div>
    )
}

export default PlaylistPage;