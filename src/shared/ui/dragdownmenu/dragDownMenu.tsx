import { FC } from "react";
import { Modal } from "../modal/modal";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IDragDownMenu {
    readonly children: JSX.Element,
    readonly className?: string,
    readonly isOpen?: boolean,
    readonly setIsOpen?: (isOpen: boolean) => void;
}

export const DragDownMenu: FC<IDragDownMenu> = ({ children, className, isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div 
                className={clsx(
                    styles["dragdown-menu"], 
                    isOpen && styles["opened"], className
                )}
            >
                <div className={styles["drag-handle"]} />
                {children}
            </div>
        </Modal>
    );
};

