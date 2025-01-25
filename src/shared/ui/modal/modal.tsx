import clsx from "clsx";
import { FC } from "react";
import "./modal.scss";

interface IModal {
    readonly children: JSX.Element,
    readonly className?: string,
    readonly isOpen?: boolean,
    readonly setIsOpen?: (isOpen: boolean) => void;
}

export const Modal: FC<IModal> = ({ children, className, isOpen, setIsOpen }) => {
    return (
        <div 
            className={clsx("modal", isOpen && "open", className)} 
            onClick={() => setIsOpen?.(false)}>
            {children}
        </div>
    )
}