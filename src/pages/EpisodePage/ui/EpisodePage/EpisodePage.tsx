import {
    CSSProperties,
    FC,
    useEffect,
    useState
} from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router";
import {
    getLibraryPlaylists,
    getLikedEpisodes,
    selectLibraryLoading,
} from "features/library";
import { getDate } from "entities/episode";
import { 
    fetchPlaybackState, 
    usePlaybackAdapter 
} from "entities/playback";
import {
    getUserInfo,
    selectUser,
    selectUserLoading
} from "entities/user";
import {
    fetchEpisode,
    IEpisode
} from "shared/api/episode";
import {
    calculateDuration,
    useAppDispatch,
    useAppSelector,
    useColor
} from "shared/lib";
import {
    Description,
    Title,
    Loader,
    DesktopTitle,
} from "shared/ui";
import {
    ArrowLeft,
    PlaceholderImage
} from "shared/assets";
import { EpisodeControlPanel } from "../EpisodeControlPanel/EpisodeControlPanel";
import styles from "./style.module.scss";


const EpisodePage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [episode, setEpisode] = useState<IEpisode | null>(null);
    const [episodeLoading, setEpisodeLoading] = useState(false);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);
    const color = useColor(episode?.images[0]?.url ?? PlaceholderImage);
    const { setApiPlayback } = usePlaybackAdapter();

    useEffect(() => {
        if (user === null) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user])

    /** Loading episode data, updating library and playbackAPI on page load. */
    useEffect(() => {
        (async () => {
            try {
                setEpisodeLoading(true);
                if (id) setEpisode(await fetchEpisode(id));

                setApiPlayback?.(await fetchPlaybackState());
                dispatch(getLikedEpisodes());
                dispatch(getLibraryPlaylists());
            } catch (e) {
                console.error(e);
            } finally {
                setEpisodeLoading(false);
            }
        })()
    }, [id]);

    return (
        <div
            className={styles["episode"]}
            style={{ '--color': color } as CSSProperties}
        >
            <Loader loading={episodeLoading || libraryLoading || userLoading} />
            <button
                className={styles["episode-button"]}
                onClick={() => navigate(-1)}
            >
                <ArrowLeft width={40} height={40} />
            </button>
            <div className={styles["episode-image-container"]}>
                <img
                    src={episode?.images[0].url || PlaceholderImage}
                    className={styles["episode-image"]}
                />
            </div>
            <div className={styles["episode-content"]}>
                <Title className={styles["episode-name"]}>
                    {episode?.name ?? ""}
                </Title>
                <DesktopTitle className={styles["episode-name__desktop"]}>
                    {episode?.name ?? ""}
                </DesktopTitle>
                <Link
                    to={`/shows/${episode?.show.id}`}
                    className={styles["episode-publisher"]}
                >
                    {episode?.show.publisher ?? ""}
                </Link>
                <div className={styles["episode-info-container"]}>
                    <Link
                        to={`/shows/${episode?.show.id}`}
                        className={styles["episode-publisher__desktop"]}
                    >
                        {episode?.show.publisher ?? ""}
                    </Link>
                    <Description>
                        {getDate(episode?.release_date, episode?.release_date_precision)}
                    </Description>
                    <Description>
                        {calculateDuration(episode?.duration_ms ?? 0)}
                    </Description>
                </div>
                <EpisodeControlPanel episode={episode} />
                <div className={styles["episode-body"]}>
                    <Title className={styles["episode-about"]}>
                        About Episode
                    </Title>
                    <p
                        className={styles["episode-description"]}
                        dangerouslySetInnerHTML={{
                            __html: episode?.html_description ?? ""
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default EpisodePage;