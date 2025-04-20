import { FC } from "react";
import clsx from "clsx";
import styles from './style.module.scss';

interface ISubtitle {
    /** Text */
    readonly children: string,
    /** Additional styles */
    readonly className?: string,
}

export const Subtitle: FC<ISubtitle> = ({ children, className }) => {
    return (
        <h4 className={clsx(styles["subtitle"], className)}>
            {children}
        </h4>
    )
}