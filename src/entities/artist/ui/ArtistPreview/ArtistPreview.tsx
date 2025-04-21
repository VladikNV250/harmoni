import { FC } from "react";
import { useNavigate } from "react-router";
import { Text } from "shared/ui";
import { IArtist } from "shared/api/artist";
import { PlaceholderImage } from "shared/assets";
import styles from "./style.module.scss";


interface IArtistPreview {
    /** Object of artist to render. */
    readonly artist: IArtist;
}

/**
 * @component ArtistPreview
 * @description Preview component of artist with cover image and name.
 * - Clicking on the cover image goes to the artist page.
 */
export const ArtistPreview: FC<IArtistPreview> = ({ artist }) => {
    const { name, images, id } = artist
    const navigate = useNavigate();

    return (
        <div
            className={styles["artist"]}
            onClick={() => navigate(`/artists/${id}`)}
        >
            <img
                src={images[0]?.url || PlaceholderImage}
                className={styles["artist-image"]}
            />
            <Text className={styles["artist-name"]}>
                {name}
            </Text>
        </div>
    )
}