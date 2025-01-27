import { FC } from "react";
import "./AlbumCard.scss";
import { Text } from "shared/ui";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import Play from "shared/assets/icons/play-big.svg?react";
import { useNavigate } from "react-router";
import { useColor } from "shared/lib";
import { IAlbum } from "shared/types";

interface IAlbumCard {
    album: IAlbum;
}

export const AlbumCard: FC<IAlbumCard> = ({ album }) => {
    const { name, artists, images } = album;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    
    return (
        <div className="album-card">
            <div className="album-content" onClick={() => navigate("/library")}>
                <div className="album-preview">
                    <img src={images[0]?.url || placeholderImage} className="album-image" />
                    <div style={{background: color}} className="album-image__back" />
                </div>
                <Text className="album-name">{name}</Text>
                <p className="album-author">{artists.map(artist => artist.name).join(", ")}</p>
            </div>
            <button className="album-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}