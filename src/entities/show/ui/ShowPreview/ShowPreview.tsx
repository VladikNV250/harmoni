import { FC } from "react";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";
import { useColor } from "shared/lib";
import { IShow, ISimplifiedShow } from "shared/api/show";
import { usePlaybackAdapter } from "entities/playback";
import { Pause, PlaceholderImage, Play } from "shared/assets";
import { toast } from "react-toastify";
import styles from './style.module.scss';


interface IShowPreview {
    readonly show: IShow | ISimplifiedShow;
}

export const ShowPreview: FC<IShowPreview> = ({ show }) => {
    const { name, publisher, images, id, uri } = show;
    const navigate = useNavigate();
    const color = useColor(images[0]?.url, false);
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
        <div className={styles["show"]}>
            <div 
                className={styles["show-content"]} 
                onClick={() => navigate(`/shows/${id}`)}
            >
                <img 
                    src={images[0]?.url || PlaceholderImage} 
                    className={styles["show-image"]} 
                />
                <div className={styles["show-body"]}>
                    <div className={styles["body-background"]} style={{background: color}} />
                    <div className={styles["body-border"]} style={{ background: color }} />
                    <Text className={styles["show-name"]}>
                        {name}
                    </Text>
                    <p className={styles["show-author"]}>
                        {publisher}
                    </p>
                </div>
            </div>
            <button 
                className={styles["show-button"]} 
                onClick={async () => await handlePlay()}
            >
                {adapter.getContextURI() === uri && adapter.getIsPlaying() ?
                <Pause width={40} height={40} /> :
                <Play width={40} height={40} />}
            </button>
        </div>
    )
}