import { FC } from "react";
import { useAppSelector } from "shared/lib";
import { selectPlayerFullsreenMode } from "widgets/Player/model/selectors";
import styles from "./style.module.scss";


export const PlayerCurtain: FC = () => {
    const fullscreen = useAppSelector(selectPlayerFullsreenMode);

    if (fullscreen) return (
        <div className={styles["player-curtain"]} />
    )
}