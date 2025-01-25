import { FC } from "react"
import { Description } from "shared/ui";
import Play from "shared/assets/icons/play-big.svg?react"
// import Pause from "shared/assets/icons/pause-big.svg?react"
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import "./RecommendationCard.scss";
import { useNavigate } from "react-router";

interface IRecommendationCard {
    title: string;
    image?: string;
    artist?: string;
}

export const RecommendationCard: FC<IRecommendationCard> = ({ image, title, artist }) => {
    const navigate = useNavigate();

    return (
        <div className="recommendation-card">
            <div className="card-content" onClick={() => navigate(`/search`)}>
                {image
                ?
                <img src={image} className="card-image" />
                :
                <img src={PlaceholderImage} className="card-image" />}
                <div className="card-body">
                    <Description className="card-title">{title}</Description>
                    {artist &&
                    <Description className="card-artist">{artist}</Description>}
                </div>
            </div>
            <button className="card-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}