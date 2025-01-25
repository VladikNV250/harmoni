import { CSSProperties, FC } from "react";
import "./typography.scss"
import clsx from "clsx";

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
        <small className={clsx("text", className)} style={style}>
            {children}
        </small>
    )
}