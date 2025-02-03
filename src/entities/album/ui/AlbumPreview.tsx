import { FC } from "react";
import "./AlbumPreview.scss";
import { Text } from "shared/ui";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import Play from "shared/assets/icons/play-big.svg?react";
import { useNavigate } from "react-router";
import { displayDate, useColor } from "shared/lib";
import { IAlbum, ISimplifiedAlbum } from "shared/api/album";

interface IAlbumPreview {
    /** Rendered album */
    readonly album: IAlbum | ISimplifiedAlbum;
    /** What display under name? */
    readonly description?: "artists" | "date-year";
}

export const AlbumPreview: FC<IAlbumPreview> = ({ album, description = "artists" }) => {
    const { name, artists, images, release_date, id } = album;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    
    return (
        <div className="album-preview">
            <div className="album-content" onClick={() => navigate(`/albums/${id}`)}>
                <div className="album-image-container">
                    <img src={images[0]?.url || placeholderImage} className="album-image" />
                    <div style={{background: color}} className="album-image__back" />
                </div>
                <Text className="album-name">{name}</Text>
                <p className="album-description">
                    {description === "artists" && artists.map(artist => artist.name).join(", ")}
                    {description === "date-year" && displayDate(release_date, "year")}
                </p>
            </div>
            <button className="album-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}