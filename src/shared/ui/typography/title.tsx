import { FC } from "react";
import clsx from "clsx";
import styles from "./style.module.scss";


interface ITitle {
    /** Text */
    readonly children: string,
    /** Additional styles */
    readonly className?: string,
}

export const Title: FC<ITitle> = ({ children, className }) => {
    return (
        <h3 className={clsx(styles["title"], className)}>
            {children}
        </h3>
    )
}