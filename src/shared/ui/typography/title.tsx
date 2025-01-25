import { FC } from "react";
import "./typography.scss"
import clsx from "clsx";

interface ITitle {
    /** Text */
    readonly children: string,
    /** Additional styles */
    readonly className?: string,
}

export const Title: FC<ITitle> = ({ children, className }) => {
    return (
        <h3 className={clsx("title", className)}>
            {children}
        </h3>
    )
}