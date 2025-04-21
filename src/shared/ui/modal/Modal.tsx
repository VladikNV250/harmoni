import { FC } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IModal {
    /** Elements that will be nested in the modal window. */
    readonly children: JSX.Element,
    /** Additional styles. */
    readonly className?: string,
    /** Controls whether the modal is visible. */
    readonly isOpen?: boolean,
    /** Callback to toggle the modal's visibility. */
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
