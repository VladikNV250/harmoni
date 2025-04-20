import { FC } from "react";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import { useNavigate } from "react-router";
import { Text } from "shared/ui";
import { IArtist } from "shared/api/artist";
import styles from "./style.module.scss";


interface IArtistPreview {
    artist: IArtist;
}

export const ArtistPreview: FC<IArtistPreview> = ({ artist }) => {
    const { name, images, id } = artist
    const navigate = useNavigate();

    return (
        <div 
            className={styles["artist"]} 
            onClick={() => navigate(`/artists/${id}`)}
        >
            <img 
                src={images[0]?.url || placeholderImage} 
                className={styles["artist-image"]} 
            />
            <Text className={styles["artist-name"]}>
                {name}
            </Text>
        </div>
    )
}