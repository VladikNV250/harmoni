import clsx from "clsx"
import { FC } from "react"
import { Like, LikeFilled } from "shared/assets"
import { Subtitle, Title } from "shared/ui"
import { usePlaybackAdapter } from "entities/playback";
import { removeTracksFromLibrary, saveTracksToLibrary } from "shared/api/user";
import { toast } from "react-toastify";
import styles from "./style.module.scss";


interface IFullscreenTrack {
    readonly activeTab: "track" | "devices" | "queue",
    readonly isLiked: boolean,
    readonly setIsLiked: (state: boolean) => void;
}

export const FullscreenTrack: FC<IFullscreenTrack> = ({ activeTab, isLiked, setIsLiked }) => {
    const { adapter } = usePlaybackAdapter();

    const handleLike = async () => {
        try {
            if (isLiked) {
                await removeTracksFromLibrary([adapter.getTrackID()]);
            } else {
                await saveTracksToLibrary([adapter.getTrackID()]);
            }
            setIsLiked(!isLiked);
        } catch (e) {
            toast.error("Something went wrong. Try again or reload the page.");
            console.error(e)
        }
    }

    
    return (
        <div 
            className={clsx(
                styles["fullscreen-track"], 
                activeTab === "track" && styles["active"]
            )}
        >
            {adapter.checkPlayback() 
            ?
            <>
                <div className={styles["fullscreen-track-image-container"]}>
                    <img 
                        src={adapter.getTrackImage()} 
                        className={styles["fullscreen-track-image"]} 
                    />
                </div>
                <div className={styles["fullscreen-track-name-container"]}>
                    <Title className={styles["fullscreen-track-name"]}>
                        {adapter.getTrackName()}
                    </Title>
                    <button 
                        className={clsx(
                            styles["fullscreen-track-button"],
                            isLiked && styles["liked"],
                        )}
                        onClick={async () => await handleLike()}
                    >
                        <LikeFilled width={40} height={40} className={styles["icon-like__filled"]} />
                        <Like width={40} height={40} className={styles["icon-like"]} />
                    </button>
                </div>
                <Subtitle className={styles["fullscreen-track-artist"]}>
                    {adapter.getArtists().map(artist => artist.name).join(", ")}
                </Subtitle>
            </>
            :
            <Title className={styles["fullscreen-track-title"]}>
                Play the track in one of the apps where Spotify is currently available
            </Title>}
            
        </div>
    )
}