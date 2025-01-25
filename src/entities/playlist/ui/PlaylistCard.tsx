import { FC } from "react";
import { IPlaylist } from "../model/type";
import "./PlaylistCard.scss";
import { useColor } from "shared/lib";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import { Text } from "shared/ui";
import Play from "shared/assets/icons/play-big.svg?react";
// import Pause from "shared/assets/icons/pause-big.svg?react";
import { useNavigate } from "react-router";

interface IPlaylistCard {
    playlist: IPlaylist;
}

export const PlaylistCard: FC<IPlaylistCard> = ({ playlist }) => {
    const { name, preview, tracks, description } = playlist;
    const color= useColor(preview || placeholderImage);
    const navigate = useNavigate();
    

    return (
        <div className="playlist-card" onContextMenu={(e) => e.preventDefault()}>
            <div className="playlist-content" onClick={() => navigate("/library")}>
                <div className="playlist-preview">
                    <img src={preview || placeholderImage} className="playlist-image" />
                    <div style={{background: color}} className="playlist-image__back" />
                    <div style={{background: color}} className="playlist-image__back" />
                </div>
                <div className="playlist-body">
                    <Text className="playlist-name">{name}</Text>
                    <Text className="playlist-tracks" style={{color}}>{`${tracks}`}</Text>
                </div>
                <p className="playlist-description">
                    {description}
                </p>
            </div>
            <button className="playlist-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}