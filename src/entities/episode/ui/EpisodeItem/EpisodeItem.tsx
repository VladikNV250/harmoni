import { FC } from "react";
import { useNavigate } from "react-router";
import { IEpisode, ISimplifiedEpisode } from "shared/api/episode";
import { Description, Paragraph } from "shared/ui";
import { getDate } from "entities/episode/lib/getDate";
import { calculateDuration } from "shared/lib";
import { 
    AddToQueue, 
    More, 
    PlaceholderImage, 
    Play 
} from "shared/assets";
import { usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


interface IEpisodeItem {
    readonly episode: IEpisode | ISimplifiedEpisode;
    readonly showURI: string;
}

export const EpisodeItem: FC<IEpisodeItem> = ({ episode, showURI }) => {
    const { 
        id,
        name, 
        description, 
        release_date, 
        release_date_precision, 
        duration_ms, 
        images,
        uri,
    } = episode;
    const { adapter } = usePlaybackAdapter();
    const navigate = useNavigate();

    const handlePlay = () => {
        adapter.play({
            context_uri: showURI,
            offset: {
                uri: uri
            }
        })
    }

    return (
        <div className={styles["episode"]}>
            <div 
                className={styles["episode-image-container"]} 
                onClick={() => navigate(`/episodes/${id}`)}
            >
                <img 
                    src={images?.[0]?.url || PlaceholderImage} 
                    className={styles["episode-image"]}    
                />
                <div className={styles["episode-body"]}>
                    <Paragraph className={styles["episode-name"]}>
                        {name ?? ""}
                    </Paragraph>
                    <Description className={styles["episode-author"]}>
                        {description ?? ""}
                    </Description>
                </div>
            </div>
            <div className={styles["episode-content"]}>
                <Description>
                    {getDate(release_date, release_date_precision)}
                </Description>
                <p>&#183;</p>
                <Description>
                    {calculateDuration(duration_ms)}
                </Description>
            </div>
            <div className={`${styles["episode-control-panel"]}`}>
                <div className={styles["button-container"]}>
                    <button className={styles["button"]}>
                        <AddToQueue width={40} height={40} />
                    </button>
                    <button className={styles["button"]}>
                        <More width={40} height={40} />
                    </button>
                </div>
                <div className={styles["button-container"]}>
                    <button className={styles["button"]} onClick={handlePlay}>
                        <Play width={40} height={40} />
                    </button>
                </div>
            </div>
        </div>
    )
}