import { FC } from "react";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";
import { displayDate, useColor } from "shared/lib";
import { IAlbum, ISimplifiedAlbum } from "shared/api/album";
import { usePlaybackAdapter } from "entities/playback";
import { Pause, PlaceholderImage, Play } from "shared/assets";
import { toast } from "react-toastify";
import styles from "./style.module.scss";

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

    const handlePlay = async () => {
        try {
            if (adapter.getContextURI() === uri) {
                await adapter.resume();
            } else {
                await adapter.play({ context_uri: uri })
            }
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }
    
    return (
        <div className={styles["album"]}>
            <div 
                className={styles["album-content"]} 
                onClick={() => navigate(`/albums/${id}`)}
            >
                <div className={styles["album-image-container"]}>
                    <img 
                        src={images[0]?.url || PlaceholderImage} 
                        className={styles["album-image"]} 
                    />
                    <div 
                        className={styles["album-image__back"]} 
                        style={{background: color}} 
                    />
                </div>
                <Text className={styles["album-name"]}>
                    {name}
                </Text>
                <p className={styles["album-description"]}>
                    {description === "artists" && artists.map(artist => artist.name).join(", ")}
                    {description === "date-year" && displayDate(release_date, "year")}
                </p>
            </div>
            <button 
                className={styles["album-button"]} 
                onClick={async () => await handlePlay()}
            >
                {adapter.getContextURI() === uri && adapter.getIsPlaying() ?
                <Pause width={40} height={40} /> :
                <Play width={40} height={40} />}
            </button>
        </div>
    )
}