import { FC } from "react";
import { Paragraph } from "shared/ui";
import { ISimplifiedTrack, ITrack } from "shared/api/track";
import { Link } from "react-router";
import { IAlbum } from "shared/api/album";
import { ArtistList } from "entities/artist";
import { usePlaybackAdapter } from "entities/playback";
import { More, PlaceholderImage } from "shared/assets";
import { toast } from "react-toastify";
import styles from "./style.module.scss";


export interface ITrackItem {
    /** Track to render */
    readonly track: ITrack | ISimplifiedTrack;
    /** Provide album if pass ISimplifiedTrack where field album doesn't exist */
    readonly defaultAlbum?: IAlbum;
    /** URI of context to play the song */
    readonly contextUri?: string,
}

export const TrackItem: FC<ITrackItem> = ({ track, defaultAlbum, contextUri }) => {
    const { name, artists, album } = track as ITrack;
    const { adapter } = usePlaybackAdapter();

    const handlePlay = async () => {
        try {
            if (contextUri) {
                await adapter.play({
                    context_uri: contextUri,
                    offset: { uri: track.uri }
                })
            }
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }
    
    return (
        <div 
            className={styles["track"]} 
            onClick={async () => await handlePlay()}>
            <img 
                src={
                    album?.images[0]?.url ?? 
                    defaultAlbum?.images[0]?.url ?? 
                    PlaceholderImage
                } 
                className={styles["track-image"]}    
            />
            <div className={styles["track-content"]}>
                <Link to={`/albums/${album?.id ?? defaultAlbum?.id ?? ""}`}>
                    <Paragraph className={styles["track-name"]}>
                        {name ?? ""}
                    </Paragraph>
                </Link>
                <div className={styles["track-artist-container"]}>
                    <ArtistList artists={artists} />
                </div>
            </div>
            <button className={styles["track-button"]}>
                <More width={40} height={40} />
            </button>
        </div>
    )
}