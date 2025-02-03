import { FC } from "react";
import { Text } from "shared/ui";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import Play from "shared/assets/icons/play-big.svg?react";
import { useNavigate } from "react-router";
import { useColor } from "shared/lib";
import "./ShowPreview.scss";
import { IShow } from "shared/api/show";

interface IShowPreview {
    show: IShow;
}

export const ShowPreview: FC<IShowPreview> = ({ show }) => {
    const { name, publisher, images, id } = show;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    
    return (
        <div className="show-preview show">
            <div className="show-content" onClick={() => navigate(`/shows/${id}`)}>
                <img src={images[0]?.url || placeholderImage} className="show-image" />
                <div className="show-body">
                    <div className="body-background" style={{background: color}} />
                    <div className="body-border" style={{ background: color }} />
                    <Text className="show-name">{name}</Text>
                    <p className="show-author">{publisher}</p>
                </div>
            </div>
            <button className="show-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}