import { FC } from "react";
import "./typography.scss"
import clsx from "clsx";

interface IParagraph {
    /** Text */
    readonly children: string,
    /** Additional styles */
    readonly className?: string,
}

export const Paragraph: FC<IParagraph> = ({ children, className }) => {
    return (
        <p className={clsx("paragraph", className)}>
            {children}
        </p>
    )
}