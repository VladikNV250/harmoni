import { CSSProperties, FC } from "react";
import clsx from "clsx";
import styles from './style.module.scss';


interface IText {
    /** Text */
    readonly children: string,
    /** Additional classes */
    readonly className?: string,
    /** Additional styles */
    readonly style?: CSSProperties 
}

export const Text: FC<IText> = ({ children, className, style }) => {
    return (
        <small className={clsx(styles["text"], className)} style={style}>
            {children}
        </small>
    )
}