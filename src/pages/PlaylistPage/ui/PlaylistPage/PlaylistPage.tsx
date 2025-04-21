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
import { TrackItem } from "features/track";
import { PlaylistEpisodeItem } from "features/episode";
import {
    getLibraryPlaylists,
    selectLibraryLoading,
} from "features/library";
import {
    SortMenu,
    TRACK_SORT_TYPES,
    TSortOrder,
    TTrackSortBy
} from "features/sort";
import {
    getUserInfo,
    selectUser,
    selectUserLoading
} from "entities/user";
import {
    fetchPlaybackState,
    usePlaybackAdapter
} from "entities/playback";
import {
    fetchPlaylist,
    IPlaylist,
} from "shared/api/playlist";
import {
    Description,
    DesktopTitle,
    ExpandableSearchInput,
    Loader,
    SearchInput,
    Subtitle,
    Title
} from "shared/ui";
import {
    calculateDuration,
    useAppDispatch,
    useAppSelector,
    useColor,
    useDebounce
} from "shared/lib";
import {
    ArrowLeft,
    PlaceholderImage,
    Sort
} from "shared/assets";
import { PlaylistControlPanel } from "../PlaylistControlPanel/PlaylistControlPanel";
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

    /** Loading playlist data, update user, library, and playbackAPI on page load */
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

    const calculateTotalDuration = (tracks?: IPlaylist["tracks"]["items"]): string => {
        let totalDuration = 0;
        tracks?.forEach(({ track }) => {
            totalDuration += track.duration_ms;
        })

        return calculateDuration(totalDuration);
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
                return sortedTracks.map(({ track }, index) => {
                    const lowerName = track.name?.toLowerCase();
                    const lowerValue = (debouncedValue as string).toLowerCase();
                    const isMatch = lowerName?.includes(lowerValue);
                    return isMatch && (
                        track.type === "track" ?
                            <TrackItem
                                key={track.id}
                                track={track}
                                sequenceNumber={index + 1}
                                showAlbum
                                showImage
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
                return sortedTracks.map(({ track }, index) =>
                    track.type === "track" ?
                        <TrackItem
                            key={track.id}
                            track={track}
                            sequenceNumber={index + 1}
                            showAlbum
                            showImage
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
        } else {
            return (
                <Subtitle className={styles["playlist-items-empty"]}>
                    No tracks available in this playlist.
                </Subtitle>
            )
        }
    }, [debouncedValue, playlist?.id, playlist?.uri, sortTracks])

    return (
        <div className={styles["playlist"]} style={{ '--color': color } as CSSProperties}>
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
                    className={styles["playlist-search"]}
                />
                <button
                    className={styles["header-button"]}
                    onClick={() => setSort(prevState => ({ ...prevState, isOpen: true }))}
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
            <div className={styles["playlist-content"]}>
                <Title className={styles["playlist-name"]}>
                    {playlist?.name ?? ""}
                </Title>
                <DesktopTitle className={styles["playlist-name__desktop"]}>
                    {playlist?.name ?? ""}
                </DesktopTitle>
                <div className={styles["playlist-description-container"]}>
                    <Link
                        to={`/profile/${playlist?.owner.id}`}
                        className={styles["playlist-owner"]}
                    >
                        <span className={styles["by"]}>
                            By
                        </span>
                        {playlist?.owner.display_name ?? ""}
                    </Link>
                    {(playlist?.tracks.total ?? 0) > 0
                        ?
                        <>
                            <Description className={styles["playlist-description"]}>
                                {`${playlist?.tracks.total} Songs`}
                            </Description>
                            <Description className={styles["playlist-description"]}>
                                {calculateTotalDuration(playlist?.tracks.items)}
                            </Description>
                        </>
                        : null
                    }
                </div>
                <div className={styles["control-panel-container"]}>
                    <PlaylistControlPanel playlist={playlist} />
                    <ExpandableSearchInput
                        value={value}
                        onChange={handleChange}
                        placeholder={"Search playlist"}
                        direction="left"
                        className={styles["playlist-search__desktop"]}
                    />
                </div>
                <header className={styles["playlist-items-header"]}>
                    <Description className={styles["sequence-number"]}>
                        #
                    </Description>
                    <Description className={styles["title"]}>
                        Title
                    </Description>
                    <div className={styles["gap"]} />
                    <Description className={styles["album"]}>
                        Album
                    </Description>
                    <Description className={styles["duration"]}>
                        Duration
                    </Description>
                    <div className={styles["gap-button"]} />
                </header>
                <div className={styles["playlist-items-body"]}>
                    {renderPlaylistTracks(playlist?.tracks.items ?? [])}
                </div>
            </div>
        </div>
    )
}

export default PlaylistPage;