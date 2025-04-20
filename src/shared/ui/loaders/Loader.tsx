import { FC } from "react";
import clsx from "clsx";
import styles from "./style.module.scss";


interface ILoader {
    readonly loading: boolean,
    readonly className?: string,
}

export const Loader: FC<ILoader> = ({ loading, className }) => {
    return (
        loading &&
        <div 
            className={clsx(
                styles["loader-modal"], 
                styles["open"],
                className
            )}
        >
            <div className={styles["loader-container"]}>
                <div className={styles["loader"]} />
            </div>
        </div>
    ) 
}
