import { IPlaylist } from "shared/api/playlist";
import styles from "./style.module.scss";
import { FC } from "react";
import { Modal } from "shared/ui";

interface IEditMenu {
    readonly playlist: IPlaylist;
    readonly isOpen: boolean;
    readonly setIsOpen: (isOpen: boolean) => void;
}

export const EditMenu: FC<IEditMenu> = ({ playlist, setIsOpen, isOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={styles["edit-wrapper"]}>
                <div className={styles["edit-menu"]} onClick={(e) => e.stopPropagation()}>
                    {playlist.name}
                </div>
            </div>        
        </Modal>
    )
}