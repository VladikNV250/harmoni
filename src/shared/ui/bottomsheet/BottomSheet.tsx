import {
    FC,
    ReactNode
} from "react";
import { Modal } from "../modal/Modal";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IBottomSheet {
    /** Nested content in bottom sheet */
    readonly children: ReactNode,
    /** Additional styles. */
    readonly className?: string,
    /** Controls whether the menu is visible. */
    readonly isOpen?: boolean,
    /** Callback to toggle the menu's visibility. */
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