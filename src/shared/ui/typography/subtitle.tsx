import { FC } from "react";
import "./typography.scss"
import clsx from "clsx";

interface ISubtitle {
    /** Text */
    readonly children: string,
    /** Additional styles */
    readonly className?: string,
}

export const Subtitle: FC<ISubtitle> = ({ children, className }) => {
    return (
        <h4 className={clsx("subtitle", className)}>
            {children}
        </h4>
    )
}