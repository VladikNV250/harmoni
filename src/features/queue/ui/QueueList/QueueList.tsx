import { FC } from "react";
import { Link } from "react-router";
import { ArtistList } from "entities/artist";
import { usePlaybackAdapter } from "entities/playback";
import { PlaceholderImage } from "shared/assets";
import { useAppSelector } from "shared/lib";
import {
    Loader,
    Paragraph,
    Subtitle
} from "shared/ui";
import {
    selectQueue,
    selectQueueLoading
} from "features/queue/model/selectors";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IQueueList {
    /** Controls whether list is visited. */
    readonly isVisited: boolean,
}

/**
 * @component QueueList
 * @description Component responsible for rendering playlback queue.
 * Clicking on track in queue to play it.
 */
export const QueueList: FC<IQueueList> = ({ isVisited }) => {
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
                styles["queue-list"],
                isVisited && styles["active"]
            )}
        >
            <header className={styles["queue-header"]}>
                <Subtitle className={styles["queue-title"]}>
                    Queue
                </Subtitle>
                <Paragraph className={styles["queue-subtitle"]}>
                    Next up:
                </Paragraph>
            </header>
            <Loader loading={loading} />
            <div className={styles["queue-tracks"]}>
                {queue?.queue.map((queueTrack, index) =>
                    queueTrack.type === "track"
                        ?
                        <div
                            key={queueTrack.id + index}
                            className={styles["queue-track"]}
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
                        <div className={styles["queue-track"]} key={queueTrack.id}>
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