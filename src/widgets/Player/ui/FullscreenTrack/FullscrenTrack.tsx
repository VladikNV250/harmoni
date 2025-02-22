import clsx from "clsx"
import { FC } from "react"
import { Like } from "shared/assets"
import { Subtitle, Title } from "shared/ui"
import "./FullscreenTrack.scss";
import { usePlaybackAdapter } from "entities/playback";

interface IFullscreenTrack {
    readonly activeTab: "track" | "devices" | "queue",
}

export const FullscreenTrack: FC<IFullscreenTrack> = ({ activeTab }) => {
    const { adapter } = usePlaybackAdapter();
    
    return (
        <div className={clsx("fullscreen-track", activeTab === "track" && "fullscreen-track__active")}>
            <div className="fullscreen-image-container">
                <img 
                    src={adapter.getTrackImage()} 
                    className="fullscreen-image" 
                />
            </div>
            <div className="fullscreen-name-container">
                <Title className="fullscreen-name">
                    {adapter.getTrackName()}
                </Title>
                <button className="fullscreen-button">
                    <Like width={40} height={40} />
                </button>
            </div>
            <Subtitle className="fullscreen-artist">
                {adapter.getArtists().map(artist => artist.name).join(", ")}
            </Subtitle>
        </div>
    )
}