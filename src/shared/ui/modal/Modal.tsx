import clsx from "clsx";
import { FC } from "react";
import styles from "./style.module.scss";
import { createPortal } from "react-dom";

interface IModal {
    readonly children: JSX.Element,
    readonly className?: string,
    readonly isOpen?: boolean,
    readonly setIsOpen?: (state: boolean) => void;
}

export const Modal: FC<IModal> = ({ children, className, isOpen, setIsOpen }) => {
    return createPortal(
        <div 
            onClick={() => setIsOpen?.(false)}
            className={clsx(
                styles["modal"], 
                isOpen && styles["open"], className
            )}> 
            {children}
        </div>,
        document.body.querySelector("#layout") ?? document.body
    )
}
