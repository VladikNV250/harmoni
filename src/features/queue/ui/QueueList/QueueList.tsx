import clsx from "clsx";
import { ArtistList } from "entities/artist";
import { FC } from "react";
import { Link } from "react-router";
import { PlaceholderImage } from "shared/assets";
import { useAppSelector } from "shared/lib";
import { Loader, Paragraph } from "shared/ui";
import { playTrack } from "shared/api/player";
import { selectQueue, selectQueueLoading } from "features/queue/model/selectors";
import { usePlaybackAdapter } from "entities/playback";
import "./QueueList.scss";

interface IQueueList {
    readonly activeTab: "track" | "devices" | "queue",
}

export const QueueList: FC<IQueueList> = ({ activeTab }) => {
    const queue = useAppSelector(selectQueue);
    const loading = useAppSelector(selectQueueLoading);
    const { adapter } = usePlaybackAdapter();

    const handleClick = async (uri: string) => {
        await playTrack({
            context_uri: adapter.getContextURI(),
            offset: { uri }
        });
    }

    return (
        <div className={clsx("fullscreen-queue", activeTab === "queue" && "fullscreen-queue__active")}>
            <Paragraph className="queue-title">Next up:</Paragraph>
            <Loader loading={loading} />
            <div className="queue-tracks">
                {queue?.queue.map((queueTrack, index) =>
                    queueTrack.type === "track" 
                    ? 
                    <div className="queue-track" key={queueTrack.id + index} onClick={async () => await handleClick(queueTrack.uri)}>
                        <img 
                            src={queueTrack.album?.images[0]?.url ?? PlaceholderImage} 
                            className="item-image"    
                        />
                        <div className="item-content">
                            <Link to={`/albums/${queueTrack.album?.id ?? ""}`}>
                                <Paragraph className="item-name">
                                    {queueTrack.name ?? ""}
                                </Paragraph>
                            </Link>
                            <div className="item-artist-container">
                                <ArtistList artists={queueTrack.artists} />
                            </div>
                        </div>
                    </div>
                    :
                    <div className="queue-track" key={queueTrack.id}>
                        <img 
                            src={queueTrack.show?.images[0]?.url ?? PlaceholderImage} 
                            className="item-image"    
                        />
                        <div className="item-content">
                            <Link to={`/shows/${queueTrack.show?.id ?? ""}`}>
                                <Paragraph className="item-name">
                                    {queueTrack.name ?? ""}
                                </Paragraph>
                            </Link>
                            <div className="item-artist-container">
                                <Paragraph className="item-publisher">
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