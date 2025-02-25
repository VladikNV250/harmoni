import clsx from "clsx";
import { FC } from "react";
import styles from "./style.module.scss";

interface IModal {
    readonly children: JSX.Element,
    readonly className?: string,
    readonly isOpen?: boolean,
    readonly setIsOpen?: (isOpen: boolean) => void;
}

export const Modal: FC<IModal> = ({ children, className, isOpen, setIsOpen }) => {
    return (
        <div 
            onClick={() => setIsOpen?.(false)}
            className={clsx(
                styles["modal"], 
                isOpen && styles["open"], className
            )}> 
            {children}
        </div>
    )
}