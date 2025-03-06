import { FC } from "react";
import { 
    FilledButton, 
    Modal, 
    Subtitle, 
    TextButton, 
    Title 
} from "shared/ui";
import { useAppDispatch } from "shared/lib";
import { librarySlice } from "features/library";
import { useNavigate } from "react-router";
import { IFolder } from "entities/folder";
import styles from "./style.module.scss";

interface IDeleteMenu {
    readonly id: IFolder["id"];
    readonly isOpen: boolean;
    readonly setIsOpen: (isOpen: boolean) => void;
}


export const DeleteMenu: FC<IDeleteMenu> = ({id, isOpen, setIsOpen}) => {   
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { deleteFolder } = librarySlice.actions;
    
    const handleDelete = () => {
        dispatch(deleteFolder(id))

        navigate("/library");
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={styles["edit-wrapper"]}>
                <div className={styles["edit-menu"]} onClick={(e) => e.stopPropagation()}>
                    <Title  className={styles["edit-title"]}>
                        Do you really want to delete this folder and all playlists inside?
                    </Title>
                    <div className={styles["edit-button-container"]}>
                        <TextButton onClick={() => setIsOpen(false)}>
                            <Subtitle className={styles["edit-button-text"]}>
                                Cancel
                            </Subtitle>
                        </TextButton>
                        <FilledButton onClick={handleDelete}>
                            <Subtitle className={styles["edit-button-text"]}>
                                Delete
                            </Subtitle>
                        </FilledButton>
                    </div>
                </div>
            </div>        
        </Modal>
    )
}