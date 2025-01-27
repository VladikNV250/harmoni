import { FC } from "react";
import { Text } from "shared/ui";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import Play from "shared/assets/icons/play-big.svg?react";
import Video from "shared/assets/icons/video.svg?react";
import { useNavigate } from "react-router";
import { useColor } from "shared/lib";
import { IEpisode } from "shared/types";
import "./EpisodeCard.scss";

interface IEpisodeCard {
    episode: IEpisode;
}

export const EpisodeCard: FC<IEpisodeCard> = ({ episode }) => {
    const { name, description, duration_ms, release_date, release_date_precision, images } = episode;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    
    return (
        <div className="episode-card episode">
            <div className="episode-content" onClick={() => navigate("/library")}>
                <img src={images[0]?.url || placeholderImage} className="episode-image" />
                <div className="episode-body">
                    <div className="body-background" style={{background: color}} />
                    <div className="header-container">
                        <Video width={20} height={20} style={{color}} />
                        <Text className="episode-name">{name}</Text>
                    </div>
                    <div className="description-container">
                        <p className="episode-author">{description}</p>
                    </div>
                </div>
            </div>
            <button className="episode-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}