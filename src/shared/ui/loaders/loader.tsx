import { FC } from "react";
import clsx from "clsx";
import styles from "./style.module.scss";


interface ILoader {
    readonly loading: boolean,
}

export const Loader: FC<ILoader> = ({ loading }) => {
    return (
        loading &&
        <div 
            className={clsx(
                styles["loader-modal"], 
                styles["open"]
            )}
        >
            <div className={styles["loader-container"]}>
                <div className={styles["loader"]} />
            </div>
        </div>
    ) 
}