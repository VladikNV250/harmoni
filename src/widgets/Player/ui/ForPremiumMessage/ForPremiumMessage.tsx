import { FC } from "react";
import { selectUser } from "entities/user";
import { Close } from "shared/assets";
import { Description } from "shared/ui";
import { useAppSelector } from "shared/lib";
import { selectPlayerOpenedMenu } from "widgets/Player/model/selectors";
import styles from "./style.module.scss";


/**
 * @component ForPremiumMessage
 */
export const ForPremiumMessage: FC = () => {
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const user = useAppSelector(selectUser);

    if (openedMenu === "device" && user?.product === "premium") return (
        <div
            className={styles["for-premium"]}
            onClick={(e) => e.currentTarget.classList.add(styles["closed"])}
        >
            <div className={styles["for-premium-wrapper"]}>
                <Description className={styles["for-premium-text"]} >
                    Select "Harmoni App" in the list of devices to play music. If you don't
                    see it in the list, reload the page.
                </Description>
            </div>
            <button className={styles["for-premium-button"]}>
                <Close width={40} height={40} />
            </button>
        </div>
    )
}