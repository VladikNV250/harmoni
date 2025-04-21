import { FC } from "react";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IDesktopTitle {
    /** Text */
    readonly children: string,
    /** Additional styles */
    readonly className?: string,
}

export const DesktopTitle: FC<IDesktopTitle> = ({ children, className }) => {
    return (
        <h2 className={clsx(styles["desktop-title"], className)}>
            {children}
        </h2>
    )
}