import { FC } from "react";
import { Modal } from "../modal/modal";
import "./dragDownMenu.scss";
import clsx from "clsx";

interface IDragDownMenu {
    readonly children: JSX.Element,
    readonly className?: string,
    readonly isOpen?: boolean,
    readonly setIsOpen?: (isOpen: boolean) => void;
}

export const DragDownMenu: FC<IDragDownMenu> = ({ children, className, isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={clsx("dragdown-menu", isOpen && "opened", className)}>
                <div className="drag-handle" />
                {children}
            </div>
        </Modal>
    );
};

