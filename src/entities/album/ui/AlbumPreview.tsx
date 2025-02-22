import { FC } from "react";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";
import { displayDate, useColor } from "shared/lib";
import { IAlbum, ISimplifiedAlbum } from "shared/api/album";
import { usePlaybackAdapter } from "entities/playback";
import { Pause, PlaceholderImage, Play } from "shared/assets";
import "./AlbumPreview.scss";

interface IAlbumPreview {
    /** Rendered album */
    readonly album: IAlbum | ISimplifiedAlbum;
    /** What display under name? */
    readonly description?: "artists" | "date-year";
}

export const AlbumPreview: FC<IAlbumPreview> = ({ album, description = "artists" }) => {
    const { name, artists, images, release_date, id, uri } = album;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    const { adapter } = usePlaybackAdapter();
    
    return (
        <div className="album-preview">
            <div className="album-content" onClick={() => navigate(`/albums/${id}`)}>
                <div className="album-image-container">
                    <img src={images[0]?.url || PlaceholderImage} className="album-image" />
                    <div style={{background: color}} className="album-image__back" />
                </div>
                <Text className="album-name">{name}</Text>
                <p className="album-description">
                    {description === "artists" && artists.map(artist => artist.name).join(", ")}
                    {description === "date-year" && displayDate(release_date, "year")}
                </p>
            </div>
            <button 
                className="album-button" 
                onClick={() => adapter.play({ context_uri: uri })}
            >
                {adapter.getContextURI() === uri ?
                <Pause width={40} height={40} /> :
                <Play width={40} height={40} />}
            </button>
        </div>
    )
}