import { CSSProperties, FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchEpisode, IEpisode } from "shared/api/episode";
import { calculateDuration, useColor } from "shared/lib";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { Description, Title, Loader } from "shared/ui";
import { getDate } from "entities/episode";
import { PagePlaybackControl } from "entities/playback";
import styles from "./style.module.scss";

const EpisodePage: FC = () => {
    const { id } = useParams();
    const [episode, setEpisode] = useState<IEpisode | null>(null);
    const [loading, setLoading] = useState(false);
    const color = useColor(episode?.images[0]?.url ?? PlaceholderImage);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (id) setEpisode(await fetchEpisode(id));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })()
    }, [id])

    return (
        <div 
            className={styles["episode"]} 
            style={{'--color': color} as CSSProperties}
        >
            <Loader loading={loading} />
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
            <PagePlaybackControl 
                contextUri={episode?.show.uri}
                episodeUri={episode?.uri}
            />
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