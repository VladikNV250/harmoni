import { FC } from "react";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";
import { calculateDuration, useColor } from "shared/lib";
import { IEpisode } from "shared/api/episode";
import { getDate } from "entities/episode/lib/getDate";
import { usePlaybackAdapter } from "entities/playback";
import { Pause, PlaceholderImage, Play } from "shared/assets";
import styles from "./style.module.scss";
import { toast } from "react-toastify";


interface IEpisodePreview {
    episode: IEpisode;
}

export const EpisodePreview: FC<IEpisodePreview> = ({ episode }) => {
    const { 
        name, 
        duration_ms, 
        release_date, 
        release_date_precision, 
        images, 
        id, 
        show, 
        uri
    } = episode;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url);
    const { adapter } = usePlaybackAdapter();

    const handlePlay = async () => {
        try {
            await adapter.play({ 
                context_uri: show.uri, 
                offset: { 
                    uri: uri 
                } 
            });
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
        
        
    }
    
    return (
        <div className={styles["episode"]}>
            <div 
                className={styles["episode-content"]} 
                onClick={() => navigate(`/episodes/${id}`)}
            >
                <img 
                    src={images[0]?.url || PlaceholderImage} 
                    className={styles["episode-image"]} 
                />
                <div className={styles["episode-body"]}>
                    <div 
                        className={styles["episode-body-background"]} 
                        style={{background: color}} 
                    />
                    <Text className={styles["episode-name"]}>
                        {name}
                    </Text>
                    <div className={styles["episode-description-container"]}>
                        <p className={styles["episode-description"]}>
                            {getDate(release_date, release_date_precision)}
                        </p>
                        <p>&#183;</p>
                        <p className={styles["episode-description"]}>
                            {calculateDuration(duration_ms)}
                        </p>
                    </div>
                </div>
            </div>
            <button 
                className={styles["episode-button"]} 
                onClick={async () => await handlePlay()}
            >
                {adapter.getTrackURI() === uri ?
                <Pause width={40} height={40} /> :
                <Play width={40} height={40} />}
            </button>
        </div>
    )
}