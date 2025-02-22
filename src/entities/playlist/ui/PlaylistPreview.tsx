import { FC } from "react";
import { useColor } from "shared/lib";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";
import { IPlaylist } from "shared/api/playlist";
import "./PlaylistPreview.scss";
import { Pause, PlaceholderImage, Play } from "shared/assets";
import { usePlaybackAdapter } from "entities/playback";

interface IPlaylistPreview {
    playlist: IPlaylist;
}

export const PlaylistPreview: FC<IPlaylistPreview> = ({ playlist }) => {
    const { name, images, tracks, description, id, uri } = playlist;
    const color= useColor(images[0]?.url || PlaceholderImage);
    const navigate = useNavigate();
    const { adapter } = usePlaybackAdapter();
    
    return (
        <div className="playlist-preview playlist" onContextMenu={(e) => e.preventDefault()}>
            <div className="playlist-content" onClick={() => navigate(`/playlists/${id}`)}>
                <div className="playlist-image-container">
                    <img src={images[0]?.url || PlaceholderImage} className="playlist-image" />
                    <div style={{background: color}} className="playlist-image__back" />
                    <div style={{background: color}} className="playlist-image__back" />
                </div>
                <div className="playlist-body">
                    <Text className="playlist-name">{name}</Text>
                    <Text className="playlist-tracks" style={{color}}>{`${tracks.total}`}</Text>
                </div>
                <p className="playlist-description">
                    {description}
                </p>
            </div>
            <button 
                className="playlist-button" 
                onClick={() => adapter.play({ context_uri: uri })}
            >
                {adapter.getContextURI() === uri ?
                <Pause width={40} height={40} /> :
                <Play width={40} height={40} />}
            </button>
        </div>
    )
}