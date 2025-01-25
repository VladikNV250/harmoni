import { FC } from "react";
import "./typography.scss"
import clsx from "clsx";

interface IDescription {
    /** Text */
    readonly children: string | JSX.Element[],
    /** Additional styles */
    readonly className?: string,
}

export const Description: FC<IDescription> = ({ children, className }) => {
    return (
        <span className={clsx("description", className)}>
            {children}
        </span>
    )
}