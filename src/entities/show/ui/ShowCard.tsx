import { FC } from "react";
import { Text } from "shared/ui";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import Play from "shared/assets/icons/play-big.svg?react";
// import Video from "shared/assets/icons/video.svg?react";
import { useNavigate } from "react-router";
import { useColor } from "shared/lib";
import { IShow } from "shared/types";
import "./ShowCard.scss";

interface IShowCard {
    show: IShow;
}

export const ShowCard: FC<IShowCard> = ({ show }) => {
    const { name, publisher, images } = show;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    
    return (
        <div className="show-card show">
            <div className="show-content" onClick={() => navigate("/library")}>
                <img src={images[0]?.url || placeholderImage} className="show-image" />
                <div className="show-body">
                    <div className="body-background" style={{background: color}} />
                    <div className="body-border" style={{ background: color }} />
                    <div className="header-container">
                        {/* <Video width={20} height={20} style={{color}} /> */}
                        <Text className="show-name">{name}</Text>
                    </div>
                    <div className="description-container">
                        <p className="show-author">{publisher}</p>
                    </div>
                </div>
            </div>
            <button className="show-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}