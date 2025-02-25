import { FC } from "react";
import { useColor } from "shared/lib";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";
import { IPlaylist } from "shared/api/playlist";
import { Pause, PlaceholderImage, Play } from "shared/assets";
import { usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


interface IPlaylistPreview {
    playlist: IPlaylist;
}

export const PlaylistPreview: FC<IPlaylistPreview> = ({ playlist }) => {
    const { name, images, tracks, description, id, uri } = playlist;
    const color= useColor(images[0]?.url || PlaceholderImage);
    const navigate = useNavigate();
    const { adapter } = usePlaybackAdapter();
    
    return (
        <div 
            className={styles["playlist"]} 
            onContextMenu={(e) => e.preventDefault()}>
            <div 
                className={styles["playlist-content"]} 
                onClick={() => navigate(`/playlists/${id}`)}
            >
                <div className={styles["playlist-image-container"]}>
                    <img src={images[0]?.url || PlaceholderImage} className={styles["playlist-image"]} />
                    <div style={{background: color}} className={styles["playlist-image__back"]} />
                    <div style={{background: color}} className={styles["playlist-image__back"]} />
                </div>
                <div className={styles["playlist-body"]}>
                    <Text className={styles["playlist-name"]}>
                        {name}
                    </Text>
                    <Text style={{color}}>
                        {`${tracks.total}`}
                    </Text>
                </div>
                <p className={styles["playlist-description"]}>
                    {description}
                </p>
            </div>
            <button 
                className={styles["playlist-button"]} 
                onClick={() => adapter.play({ context_uri: uri })}
            >
                {adapter.getContextURI() === uri ?
                <Pause width={40} height={40} /> :
                <Play width={40} height={40} />}
            </button>
        </div>
    )
}