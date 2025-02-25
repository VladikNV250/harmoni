import { FC } from "react";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IParagraph {
    /** Text */
    readonly children: string,
    /** Additional styles */
    readonly className?: string,
}

export const Paragraph: FC<IParagraph> = ({ children, className }) => {
    return (
        <p className={clsx(styles["paragraph"], className)}>
            {children}
        </p>
    )
}