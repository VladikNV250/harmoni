import { FC } from "react";
import "./PodcastCard.scss";
import { IPodcast } from "../model/types";
import { Text } from "shared/ui";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import Play from "shared/assets/icons/play-big.svg?react";
// import Video from "shared/assets/icons/video.svg?react";
import { useNavigate } from "react-router";
import { useColor } from "shared/lib";

interface IPodcastCard {
    podcast: IPodcast;
}

export const PodcastCard: FC<IPodcastCard> = ({ podcast }) => {
    const { name, author, preview } = podcast;
    const navigate = useNavigate();
    const color = useColor(preview);
    
    return (
        <div className="podcast-card podcast">
            <div className="podcast-content" onClick={() => navigate("/library")}>
                <img src={preview || placeholderImage} className="podcast-image" />
                <div className="podcast-body">
                    <div className="body-background" style={{background: color}} />
                    <div className="body-border" style={{ background: color }} />
                    <div className="header-container">
                        {/* <Video width={20} height={20} style={{color}} /> */}
                        <Text className="podcast-name">{name}</Text>
                    </div>
                    <div className="description-container">
                        <p className="podcast-author">{author}</p>
                    </div>
                </div>
            </div>
            <button className="podcast-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}