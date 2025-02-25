import { FC } from "react";
import { Close } from "shared/assets";
import { Description } from "shared/ui";
import styles from "./style.module.scss";

interface IForPremiumMessage {
    readonly activeTab: "track" | "devices" | "queue"
}

export const ForPremiumMessage: FC<IForPremiumMessage> = ({ activeTab }) => {
    if (activeTab === "devices")  return (
        <div 
            className={styles["for-premium"]} 
            onClick={(e) => e.currentTarget.classList.add(styles["closed"])}
        >
            <div className={styles["for-premium-wrapper"]}>
                <Description className={styles["for-premium-text"]} >
                    If you have Spotify Premium, you can listen to music here!   
                    Just select "Harmoni App" in the list of devices. If you don't 
                    see it in the list, reload the page.                     
                </Description>
            </div>
            <button className={styles["for-premium-button"]}>
                <Close width={40} height={40} />
            </button>
        </div>
    )
}