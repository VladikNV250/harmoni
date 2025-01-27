import { FC } from "react";
import "./ArtistCard.scss";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import { useNavigate } from "react-router";
import { Text } from "shared/ui";
import { IArtist } from "shared/types";

interface IArtistCard {
    artist: IArtist;
}

export const ArtistCard: FC<IArtistCard> = ({ artist }) => {
    const { name, images } = artist
    const navigate = useNavigate();

    return (
        <div className="artist-card" onClick={() => navigate("/library")}>
            <img src={images[0]?.url || placeholderImage} className="artist-image" />
            <Text className="artist-name">{name}</Text>
        </div>
    )
}