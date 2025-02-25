import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { 
    AddToPlaylist, 
    AddToQueue, 
    More, 
    Pause, 
    Play, 
    Shuffle 
} from "shared/assets";
import { usePlaybackAdapter } from "entities/playback/lib/usePlaybackAdapter";
import styles from "./style.module.scss";


interface IPagePlaybackControl {
    /** Additional classes */
    readonly className?: string;
    /** Context uri of playing */
    readonly contextUri?: string,
    /** Episode uri if we play episode */
    readonly episodeUri?: string,
}

export const PagePlaybackControl: FC<IPagePlaybackControl> = ({ className, contextUri, episodeUri }) => {
    const [shuffle, setShuffle] = useState(false);
    const { adapter } = usePlaybackAdapter();
    
    useEffect(() => {
        if (adapter.getContextURI() === contextUri) {
            setShuffle(adapter.getShuffle());
        }
    }, [adapter, contextUri]);

    const handlePlay = () => {
        const type = contextUri?.split(":")?.[1] // spotify:episode:1331414 --> episode

        switch (type) {
            case "episode":
                adapter.play({
                    context_uri: contextUri || null,
                    offset: {
                        uri: episodeUri || null
                    }
                })
                break;
            default:
                adapter.play({
                    context_uri: contextUri || null,
                })
        }

        adapter.toggleShuffle(shuffle);
    }

    const toggleShuffle = () => {
        setShuffle(!shuffle);

        if (adapter.getContextURI() === contextUri) {
            adapter.toggleShuffle(!shuffle);
        } 
    }

    return (
        <div className={clsx(styles["control-panel"], className)}>
            <div className={styles["control-panel-button-container"]}>
                <button className={styles["control-panel-button"]}>
                    <AddToPlaylist width={40} height={40} />
                </button>
                <button className={styles["control-panel-button"]}>
                    <AddToQueue width={40} height={40} />
                </button>
                <button className={styles["control-panel-button"]}>
                    <More width={40} height={40} />
                </button>
            </div>
            <div className={styles["control-panel-button-container"]}>
                <button 
                    className={styles["control-panel-button"]} 
                    onClick={toggleShuffle}
                >
                    <Shuffle width={40} height={40} />
                </button>
                <button 
                    className={styles["control-panel-button"]} 
                    onClick={handlePlay}
                >
                    {adapter.getContextURI() === contextUri ?
                    <Pause width={40} height={40} /> :
                    <Play width={40} height={40} />}
                </button>
            </div>
        </div>
    )
}