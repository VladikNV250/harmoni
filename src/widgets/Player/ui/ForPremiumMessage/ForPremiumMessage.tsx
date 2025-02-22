import { FC } from "react";
import { Close } from "shared/assets";
import { Description } from "shared/ui";
import "./ForPremiumMessage.scss";

interface IForPremiumMessage {
    readonly activeTab: "track" | "devices" | "queue"
}

export const ForPremiumMessage: FC<IForPremiumMessage> = ({ activeTab }) => {
    if (activeTab === "devices")  return (
        <div 
            className="fullscreen-for-premium-container" 
            onClick={(e) => e.currentTarget.classList.add("closed")}
        >
            <div className="fullscreen-wrapper">
                <Description className="fullscreen-for-premium" >
                    If you have Spotify Premium, you can listen to music here!   
                    Just select "Harmoni App" in the list of devices. If you don't 
                    see it in the list, reload the page.                     
                </Description>
            </div>
            <button className="fullscreen-for-premium-close">
                <Close width={40} height={40} />
            </button>
        </div>
    )
}