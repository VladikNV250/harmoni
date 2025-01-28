import { FC } from "react";
import "./ArtistPreview.scss";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import { useNavigate } from "react-router";
import { Text } from "shared/ui";
import { IArtist } from "shared/api/artist";

interface IArtistPreview {
    artist: IArtist;
}

export const ArtistPreview: FC<IArtistPreview> = ({ artist }) => {
    const { name, images } = artist
    const navigate = useNavigate();

    return (
        <div className="artist-preview" onClick={() => navigate("/library")}>
            <img src={images[0]?.url || placeholderImage} className="artist-image" />
            <Text className="artist-name">{name}</Text>
        </div>
    )
}