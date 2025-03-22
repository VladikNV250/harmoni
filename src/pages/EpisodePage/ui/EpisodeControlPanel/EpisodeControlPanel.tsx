import { 
    FC, 
    useMemo, 
} from "react";
import { 
    AddIcon, 
    AddToQueue, 
    CheckFilled, 
    Pause, 
    Play 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    addItemToQueue, 
    getUserQueue 
} from "features/queue";
import { 
    removeEpisodesFromLibrary, 
    saveEpisodesToLibrary 
} from "shared/api/user";
import { 
    getLikedEpisodes, 
    selectLikedEpisodes, 
} from "features/library";
import { usePlaybackAdapter } from "entities/playback";
import { IEpisode } from "shared/api/episode";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IEpisodeControlPanel {
    readonly episode: IEpisode | null;
}

export const EpisodeControlPanel: FC<IEpisodeControlPanel> = ({ episode }) => {
    const dispatch = useAppDispatch();
    const { adapter } = usePlaybackAdapter();
    const libraryEpisodes = useAppSelector(selectLikedEpisodes);

    const isEpisodeInLibrary = useMemo(
        () => libraryEpisodes.findIndex(item => item.episode.id === episode?.id) !== -1,
        [libraryEpisodes, episode]
    )

    const handlePlay = async () => {
        try {
            await adapter.play({ 
                context_uri: episode?.show?.uri ?? "",
                offset: {
                    uri: episode?.uri ?? "",
                } 
            });
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const saveEpisode = async () => {
        try {
            if (isEpisodeInLibrary) {
                await removeEpisodesFromLibrary([episode?.id ?? ""]);
                toast.info("The episode have been removed from the library.");
            } else {
                await saveEpisodesToLibrary([episode?.id ?? ""]);
                toast.info("The episode have been added to the library.");
            }
            dispatch(getLikedEpisodes());
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("PLAY", e);
        }
    }

    const addToQueueHandle = async () => {
        try {
            if (!episode) {
                toast.error("Something went wrong. Try again or reload the page.");
                return;
            }
            
            await addItemToQueue(episode.uri);
            await dispatch(getUserQueue());
            toast.info("The episode have been added to the queue.");
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error("ADD-ITEM-TO-QUEUE", e);
        }
    }

    return (
        <>
            <div className={styles["episode-control-panel"]}>
                <div className={styles["control-panel-button-container"]}>
                    <button 
                        className={styles["control-panel-button"]} 
                        onClick={async () => await handlePlay()}
                        >
                        {adapter.getTrackURI() === episode?.uri ?
                        <Pause width={60} height={60} /> :
                        <Play width={60} height={60} />}
                    </button>
                    <button
                        className={clsx(
                            styles["control-panel-button"],
                            isEpisodeInLibrary && styles["active"]
                        )}
                        onClick={async () => await saveEpisode()}
                    >
                        <AddIcon width={50} height={50} className={styles["icon"]} />
                        <CheckFilled width={50} height={50} className={styles["icon__active"]} />
                    </button>
                    <button
                        className={styles["control-panel-button"]}
                        onClick={async () => await addToQueueHandle()}
                    >
                        <AddToQueue width={50} height={50} />
                    </button>
                </div>
            </div>
        </>
    )
}