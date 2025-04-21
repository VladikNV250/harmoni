import { FC } from "react"
import { usePlaybackAdapter } from "entities/playback";
import { 
    Like, 
    LikeFilled 
} from "shared/assets"
import { 
    Subtitle, 
    Title 
} from "shared/ui"
import { useAppSelector } from "shared/lib";
import { selectPlayerOpenedMenu } from "widgets/Player/model/selectors";
import clsx from "clsx"
import styles from "./style.module.scss";


interface IFullscreenTrack {
    /** Controls whether track is saved in the library. */
    readonly isLiked: boolean,
    /** Callback to save or remove track from the library. */
    readonly handleLike: () => Promise<void>;
}

/**
 * @component FullscreenTrack
 * @description Component responsible for rendering track's cover image, name, artists.
 * Allows you to add or remove track to the library.
 */
export const FullscreenTrack: FC<IFullscreenTrack> = ({ isLiked, handleLike }) => {
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const { adapter } = usePlaybackAdapter();


    return (
        <div
            className={clsx(
                styles["fullscreen-track"],
                (openedMenu === "track" || (openedMenu !== "device" && openedMenu !== "queue")) && styles["active"]
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
                    <div className={styles["fullscreen-track-content"]}>
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
                    </div>
                </>
                :
                <Title className={styles["fullscreen-track-title"]}>
                    Play the track in one of the apps where Spotify is currently available
                </Title>}
        </div>
    )
}