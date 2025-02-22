import { 
    CSSProperties, 
    FC, 
    MouseEvent
} from "react";
import { 
    Device,
    Hide, 
    Like, 
    PauseSimple,
    PlaySimple
} from "shared/assets";
import { 
    useAppDispatch, 
    usePress 
} from "shared/lib";
import { Description } from "shared/ui";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { usePlaybackAdapter } from "entities/playback";
import "./MinimizedPlayer.scss";

interface IMinimizedPlayer {
    readonly color: string,
    readonly chooseTab: (tab: "devices" | "queue" | "track") => void,
}

export const MinimizedPlayer: FC<IMinimizedPlayer> = ({ color, chooseTab }) => {
    const dispatch = useAppDispatch();
    const { toggleFullscreenMode } = playerSlice.actions;
    const { isPressed, startPress, endPress, clearPressTime } = usePress();
    const { adapter } = usePlaybackAdapter();

    const handleClick = () => {
        if (!isPressed) dispatch(toggleFullscreenMode());
    }

    const handlePlay = (e: MouseEvent) => {
        e.stopPropagation();
        adapter.resume();
    }

    return (
        <div 
            className="minimized-player"
            onMouseLeave={endPress}            
            style={{"--color": color} as CSSProperties}>
            {isPressed && 
            <div className="minimized-player-options" onClick={endPress}>
                <button className="option-button">
                    <Hide width={40} height={40} />
                </button>
                <button className="option-button">
                    <Like width={40} height={40} />
                </button>
            </div>
            }
            <div 
                className="minimized-player-track"
                onClick={handleClick}
                onMouseDown={startPress}
                onMouseUp={clearPressTime}
                onTouchStart={startPress}
                onTouchEnd={clearPressTime}>
                <img src={adapter.getTrackImage()} className="track-image" />
                <div className="track-body">
                    <Description className="track-name">
                        {adapter.getTrackName()}
                    </Description>
                    <Description className="track-artist">
                        {adapter.getArtists().map(artist => artist.name).join(", ")}
                    </Description>
                </div>
                <button className="track-button" onClick={(e) => {
                    e.stopPropagation(); 
                    dispatch(toggleFullscreenMode()); 
                    chooseTab("devices")
                }}>
                    <Device width={40} height={40} />
                </button>
                <button 
                    className="track-button" 
                    onClick={handlePlay}
                    disabled={adapter.getCurrentDevice() !== "Harmoni App Player"}
                >
                    {adapter.getIsPlaying()
                    ? <PauseSimple width={40} height={40} />
                    : <PlaySimple width={40} height={40} />}
                </button>
                <div className="track-progress-bar-container">
                    <div 
                        className="track-progress-bar" 
                        style={{
                            width: `${adapter.getProcessInPercent()}%`
                        }} 
                    />
                </div>
            </div>
        </div>
    )
}