import clsx from "clsx"
import { FC } from "react"
import { Like } from "shared/assets"
import { Subtitle, Title } from "shared/ui"
import { usePlaybackAdapter } from "entities/playback";
import styles from "./style.module.scss";


interface IFullscreenTrack {
    readonly activeTab: "track" | "devices" | "queue",
}

export const FullscreenTrack: FC<IFullscreenTrack> = ({ activeTab }) => {
    const { adapter } = usePlaybackAdapter();
    
    return (
        <div 
            className={clsx(
                styles["fullscreen-track"], 
                activeTab === "track" && styles["active"]
            )}
        >
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
                <button className={styles["fullscreen-track-button"]}>
                    <Like width={40} height={40} />
                </button>
            </div>
            <Subtitle className={styles["fullscreen-track-artist"]}>
                {adapter.getArtists().map(artist => artist.name).join(", ")}
            </Subtitle>
        </div>
    )
}