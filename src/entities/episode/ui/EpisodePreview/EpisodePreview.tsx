import { FC } from "react";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";
import { calculateDuration, useColor } from "shared/lib";
import { IEpisode } from "shared/api/episode";
import { getDate } from "entities/episode/lib/getDate";
import { usePlaybackAdapter } from "entities/playback";
import { Pause, PlaceholderImage, Play } from "shared/assets";
import "./EpisodePreview.scss";

interface IEpisodePreview {
    episode: IEpisode;
}

export const EpisodePreview: FC<IEpisodePreview> = ({ episode }) => {
    const { 
        name, 
        duration_ms, 
        release_date, 
        release_date_precision, 
        images, 
        id, 
        show, 
        uri
    } = episode;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    const { adapter } = usePlaybackAdapter();

    const handlePlay = () => {
        adapter.play({ 
            context_uri: show.uri, 
            offset: { 
                uri: uri 
            } 
        });
    }
    
    return (
        <div className="episode-preview episode">
            <div className="episode-content" onClick={() => navigate(`/episodes/${id}`)}>
                <img src={images[0]?.url || PlaceholderImage} className="episode-image" />
                <div className="episode-body">
                    <div className="body-background" style={{background: color}} />
                    <Text className="episode-name">{name}</Text>
                    <div className="episode-description-container">
                        <p className="episode-description">
                            {getDate(release_date, release_date_precision)}
                        </p>
                        <p className="dot">&#183;</p>
                        <p className="episode-description">
                            {calculateDuration(duration_ms)}
                        </p>
                    </div>
                </div>
            </div>
            <button className="episode-button" onClick={handlePlay}>
                {adapter.getTrackURI() === uri ?
                <Pause width={40} height={40} /> :
                <Play width={40} height={40} />}
            </button>
        </div>
    )
}