import { FC } from "react";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IDescription {
    /** Text */
    readonly children: string | JSX.Element[],
    /** Additional styles */
    readonly className?: string,
}

export const Description: FC<IDescription> = ({ children, className }) => {
    return (
        <span className={clsx(styles["description"], className)}>
            {children}
        </span>
    )
}