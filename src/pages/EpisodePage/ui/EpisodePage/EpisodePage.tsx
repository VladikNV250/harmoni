import { 
    CSSProperties, 
    FC, 
    useEffect, 
    useState 
} from "react";
import { 
    Link, 
    useParams 
} from "react-router";
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
} from "shared/ui";
import { 
    getUserInfo, 
    selectUser, 
    selectUserLoading 
} from "entities/user";
import { PlaceholderImage } from "shared/assets";
import { 
    getLibraryPlaylists, 
    getLikedEpisodes, 
    selectLibraryLoading, 
} from "features/library";
import { getDate } from "entities/episode";
import { usePlaybackAdapter } from "entities/playback";
import { fetchPlaybackState } from "entities/playback/api/playback";
import { EpisodeControlPanel } from "../EpisodeControlPanel/EpisodeControlPanel";
import styles from "./style.module.scss";


const EpisodePage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
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
            style={{'--color': color} as CSSProperties}
        >
            <Loader loading={episodeLoading || libraryLoading || userLoading} />
            <div className={styles["episode-image-container"]}>
                <img 
                    src={episode?.images[0].url || PlaceholderImage} 
                    className={styles["episode-image"]} 
                />
            </div>
            <Title className={styles["episode-name"]}>
                {episode?.name ?? ""}
            </Title>
            <Link 
                to={`/shows/${episode?.show.id}`} 
                className={styles["episode-author"]}
            >
                {episode?.show.publisher ?? ""}
            </Link>
            <div className={styles["episode-info-container"]}>
                <Description>
                    {getDate(episode?.release_date, episode?.release_date_precision)}
                </Description>
                <p>&#183;</p>
                <Description>
                    {calculateDuration(episode?.duration_ms ?? 0)}
                </Description>
            </div>
            <EpisodeControlPanel episode={episode} />
            <div className={styles["episode-content"]}>
                <p 
                    className={styles["episode-description"]} 
                    dangerouslySetInnerHTML={{
                        __html: episode?.html_description ?? ""
                    }} 
                />
            </div>
        </div>
    )
}

export default EpisodePage;