import { FC } from "react";
import { useNavigate } from "react-router";
import { usePlaybackAdapter } from "entities/playback";
import { useColor } from "shared/lib";
import { Text } from "shared/ui";
import {
    IPlaylist,
    ISimplifiedPlaylist
} from "shared/api/playlist";
import {
    Pause,
    PlaceholderImage,
    Play
} from "shared/assets";
import { toast } from "react-toastify";
import styles from "./style.module.scss";


interface IPlaylistPreview {
    /** Object of playlist, which will be rendered. */
    readonly playlist: IPlaylist | ISimplifiedPlaylist;
}

/**
 * @component PlaylistPreview
 * @description Preview component of playlist with cover image, name, description and Play/Pause button.
 * - Clicking on cover image goes to the playlist page.
 * - Clicking the play/resume button to play playlist using the PlaybackAPI.
 */
export const PlaylistPreview: FC<IPlaylistPreview> = ({ playlist }) => {
    const { name, images, tracks, description, id, uri } = playlist;
    const color = useColor(images?.[0]?.url || PlaceholderImage);
    const navigate = useNavigate();
    const { adapter } = usePlaybackAdapter();

    const handlePlay = async () => {
        try {
            if (adapter.getContextURI() === uri) {
                await adapter.resume();
            } else {
                await adapter.play({ context_uri: uri });
            }
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    return (
        <div
            className={styles["playlist"]}
            onContextMenu={(e) => e.preventDefault()}>
            <div
                className={styles["playlist-content"]}
                onClick={() => navigate(`/playlists/${id}`)}
            >
                <div className={styles["playlist-image-container"]}>
                    <img src={images?.[0]?.url || PlaceholderImage} className={styles["playlist-image"]} />
                    <div style={{ background: color }} className={styles["playlist-image__back"]} />
                    <div style={{ background: color }} className={styles["playlist-image__back"]} />
                </div>
                <div className={styles["playlist-body"]}>
                    <Text className={styles["playlist-name"]}>
                        {name ?? ""}
                    </Text>
                    <Text style={{ color }}>
                        {`${tracks.total}`}
                    </Text>
                </div>
                <p className={styles["playlist-description"]}>
                    {description ?? ""}
                </p>
            </div>
            <button
                className={styles["playlist-button"]}
                onClick={async () => await handlePlay()}
            >
                {adapter.getContextURI() === uri && adapter.getIsPlaying() ?
                    <Pause width={40} height={40} /> :
                    <Play width={40} height={40} />}
            </button>
        </div>
    )
}