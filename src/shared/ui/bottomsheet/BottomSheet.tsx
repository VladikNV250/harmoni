import { FC, ReactNode } from "react";
import { Modal } from "../modal/Modal";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IBottomSheet {
    readonly children: ReactNode,
    readonly className?: string,
    readonly isOpen?: boolean,
    readonly setIsOpen: (isOpen: boolean) => void;
}

export const BottomSheet: FC<IBottomSheet> = ({ children, className, isOpen, setIsOpen }) => {
    return (
        <Modal className={className} isOpen={isOpen} setIsOpen={setIsOpen}>
            <div 
                className={clsx(
                    styles["bottom-sheet"], 
                    isOpen && styles["opened"], 
                )}
            >
                <div className={styles["bottom-sheet-content"]}>
                    {children}
                </div>
            </div>
        </Modal>
    );
};