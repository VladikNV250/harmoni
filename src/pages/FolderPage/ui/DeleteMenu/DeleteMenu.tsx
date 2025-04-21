import { FC } from "react";
import { useNavigate } from "react-router";
import { librarySlice } from "features/library";
import { IFolder } from "entities/folder";
import {
    FilledButton,
    Modal,
    Subtitle,
    TextButton,
    Title
} from "shared/ui";
import { useAppDispatch } from "shared/lib";
import styles from "./style.module.scss";

interface IDeleteMenu {
    /** Id of the folder that can be deleted */
    readonly id: IFolder["id"];
    /** Controls whether menu is visible */
    readonly isOpen: boolean;
    /** Callback to toggle the menu's visibility */
    readonly setIsOpen: (isOpen: boolean) => void;
}

/**
 * @component DeleteMenu
 * @description Confirmation modal for deleting a folder with its playlists.
 */
export const DeleteMenu: FC<IDeleteMenu> = ({ id, isOpen, setIsOpen }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { deleteFolder } = librarySlice.actions;

    const handleDelete = () => {
        dispatch(deleteFolder(id))
        navigate("/library");
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={styles["delete-wrapper"]}>
                <div className={styles["delete-menu"]} onClick={(e) => e.stopPropagation()}>
                    <Title className={styles["delete-title"]}>
                        Do you really want to delete this folder and all playlists inside?
                    </Title>
                    <div className={styles["delete-button-container"]}>
                        <TextButton onClick={() => setIsOpen(false)}>
                            <Subtitle className={styles["delete-button-text"]}>
                                Cancel
                            </Subtitle>
                        </TextButton>
                        <FilledButton onClick={handleDelete}>
                            <Subtitle className={styles["delete-button-text"]}>
                                Delete
                            </Subtitle>
                        </FilledButton>
                    </div>
                </div>
            </div>
        </Modal>
    )
}