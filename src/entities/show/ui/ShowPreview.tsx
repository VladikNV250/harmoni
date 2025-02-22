import { FC } from "react";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";
import { useColor } from "shared/lib";
import { IShow } from "shared/api/show";
import { usePlaybackAdapter } from "entities/playback";
import { Pause, PlaceholderImage, Play } from "shared/assets";
import "./ShowPreview.scss";

interface IShowPreview {
    show: IShow;
}

export const ShowPreview: FC<IShowPreview> = ({ show }) => {
    const { name, publisher, images, id, uri } = show;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    const { adapter } = usePlaybackAdapter();
    
    return (
        <div className="show-preview show">
            <div className="show-content" onClick={() => navigate(`/shows/${id}`)}>
                <img src={images[0]?.url || PlaceholderImage} className="show-image" />
                <div className="show-body">
                    <div className="body-background" style={{background: color}} />
                    <div className="body-border" style={{ background: color }} />
                    <Text className="show-name">{name}</Text>
                    <p className="show-author">{publisher}</p>
                </div>
            </div>
            <button 
                className="show-button" 
                onClick={() => adapter.play({ context_uri: uri })}
            >
                {adapter.getContextURI() === uri ?
                <Pause width={40} height={40} /> :
                <Play width={40} height={40} />}
            </button>
        </div>
    )
}