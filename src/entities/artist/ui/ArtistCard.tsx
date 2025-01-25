import { FC } from "react";
import "./ArtistCard.scss";
import { IArtist } from "../model/types";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import { useNavigate } from "react-router";
import { Text } from "shared/ui";

interface IArtistCard {
    artist: IArtist;
}

export const ArtistCard: FC<IArtistCard> = ({ artist }) => {
    const { name, preview } = artist
    const navigate = useNavigate();

    return (
        <div className="artist-card" onClick={() => navigate("/library")}>
            <img src={preview || placeholderImage} className="artist-image" />
            <Text className="artist-name">{name}</Text>
        </div>
    )
}