import { CSSProperties, FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchEpisode, IEpisode } from "shared/api/episode";
import { calculateDuration, useColor } from "shared/lib";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { Description, Title, Loader } from "shared/ui";
import { getDate } from "entities/episode";
import { ControlPanel } from "features/controlPanel";
import './EpisodePage.scss';

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
        <div className="episode-page" style={{'--color': color} as CSSProperties}>
            <Loader loading={loading} />
            <div className="episode-image-container">
                <img 
                    src={episode?.images[0].url || PlaceholderImage} 
                    className="episode-image" 
                />
            </div>
            <Title className="episode-name">{episode?.name ?? ""}</Title>
            <Link 
                to={`/shows/${episode?.show.id}`} 
                className="episode-author"
            >
                {episode?.show.publisher ?? ""}
            </Link>
            <div className="episode-info-container">
                <Description className="episode-date">
                    {getDate(episode?.release_date, episode?.release_date_precision)}
                </Description>
                <p className="dot">&#183;</p>
                <Description className="episode-duration">
                    {calculateDuration(episode?.duration_ms ?? 0)}
                </Description>
            </div>
            <ControlPanel addToPlaylist={false} />
            <div className="episode-content">
                <p 
                    className="episode-description" 
                    dangerouslySetInnerHTML={{
                        __html: episode?.html_description ?? ""
                    }} 
                />
            </div>
        </div>
    )
}

export default EpisodePage;