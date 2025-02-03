import { FC } from "react";
import More from "shared/assets/icons/more-big.svg?react";
import Play from "shared/assets/icons/play-big.svg?react";
import AddToQueue from "shared/assets/icons/add-to-queue-big.svg?react";
import Shuffle from "shared/assets/icons/shuffle-big.svg?react";
import Loop from "shared/assets/icons/loop-big.svg?react";
import AddToPlaylist from "shared/assets/icons/add-to-playlist-big.svg?react";
// import Pause from "shared/assets/icons/pause-big.svg?react";
import "./ControlPanel.scss";
import clsx from "clsx";

interface IControlPanel {
    /** Additional classes */
    readonly className?: string;
    /** Include AddToPlaylist function in Control Panel? */
    readonly addToPlaylist?: boolean,
}

export const ControlPanel: FC<IControlPanel> = ({ className, addToPlaylist = true }) => {
    return (
        <div className={clsx("control-panel", className)}>
            <div className="control-panel-button-container">
                {addToPlaylist &&
                <button className="control-panel-button">
                    <AddToPlaylist width={40} height={40} />
                </button>}
                <button className="control-panel-button">
                    <AddToQueue width={40} height={40} />
                </button>
                <button className="control-panel-button">
                    <More width={40} height={40} />
                </button>
            </div>
            <div className="control-panel-button-container">
                <button className="control-panel-button">
                    <Loop width={40} height={40} />
                </button>
                <button className="control-panel-button">
                    <Shuffle width={40} height={40} />
                </button>
                <button className="control-panel-button">
                    <Play width={40} height={40} />
                </button>
            </div>
        </div>
    )
}