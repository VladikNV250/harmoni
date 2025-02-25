import clsx from "clsx";
import { ArtistList } from "entities/artist";
import { FC } from "react";
import { Link } from "react-router";
import { PlaceholderImage } from "shared/assets";
import { useAppSelector } from "shared/lib";
import { Loader, Paragraph } from "shared/ui";
import { selectQueue, selectQueueLoading } from "features/queue/model/selectors";
import { usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


interface IQueueList {
    readonly activeTab: "track" | "devices" | "queue",
}

export const QueueList: FC<IQueueList> = ({ activeTab }) => {
    const queue = useAppSelector(selectQueue);
    const loading = useAppSelector(selectQueueLoading);
    const { adapter } = usePlaybackAdapter();

    const handleClick = (uri: string) => {
        adapter.play({
            context_uri: adapter.getContextURI(),
            offset: { uri }
        });
    }

    return (
        <div 
            className={clsx(
                styles["fullscreen-queue"], 
                activeTab === "queue" && styles["active"]
            )}
        >
            <Paragraph className={styles["fullscreen-queue-title"]}>
                Next up:
            </Paragraph>
            <Loader loading={loading} />
            <div className={styles["fullscreen-queue-tracks"]}>
                {queue?.queue.map((queueTrack, index) =>
                    queueTrack.type === "track" 
                    ? 
                    <div 
                        key={queueTrack.id + index} 
                        className={styles["fullscreen-queue-track"]} 
                        onClick={() => handleClick(queueTrack.uri)}
                    >
                        <img 
                            src={queueTrack.album?.images[0]?.url ?? PlaceholderImage} 
                            className={styles["track-image"]}    
                        />
                        <div className={styles["track-content"]}>
                            <Link to={`/albums/${queueTrack.album?.id ?? ""}`}>
                                <Paragraph className={styles["track-name"]}>
                                    {queueTrack.name ?? ""}
                                </Paragraph>
                            </Link>
                            <div className={styles["track-artist-container"]}>
                                <ArtistList artists={queueTrack.artists} />
                            </div>
                        </div>
                    </div>
                    :
                    <div className={styles["fullscreen-queue-track"]} key={queueTrack.id}>
                        <img 
                            src={queueTrack.show?.images[0]?.url ?? PlaceholderImage} 
                            className={styles["track-image"]}    
                        />
                        <div className={styles["track-content"]}>
                            <Link to={`/shows/${queueTrack.show?.id ?? ""}`}>
                                <Paragraph className={styles["track-name"]}>
                                    {queueTrack.name ?? ""}
                                </Paragraph>
                            </Link>
                            <div className={styles["track-artist-container"]}>
                                <Paragraph className={styles["track-publisher"]}>
                                    {queueTrack.show.publisher ?? ""}
                                </Paragraph>
                            </div>
                        </div>
                    </div> 
                )}
            </div>
        </div>
    )
}