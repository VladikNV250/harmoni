import { FC } from "react";
import { 
    FilledButton, 
    Modal, 
    Subtitle, 
    TextButton, 
    Title 
} from "shared/ui";
import { useNavigate } from "react-router";
import styles from "./style.module.scss";
import { IPlaylist, unfollowPlaylist } from "shared/api/playlist";
import { toast } from "react-toastify";
import { useAppDispatch } from "shared/lib";
import { getLibraryPlaylists } from "features/library";

interface IDeleteMenu {
    readonly id: IPlaylist["id"];
    readonly isOpen: boolean;
    readonly setIsOpen: (isOpen: boolean) => void;
}


export const DeleteMenu: FC<IDeleteMenu> = ({id, isOpen, setIsOpen}) => {   
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        try {
            await unfollowPlaylist(id);
            toast.info("The playlist has been removed from the library.");
            dispatch(getLibraryPlaylists());

            navigate(-1);
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("PLAY", e);
        }
    }

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={styles["edit-wrapper"]}>
                <div className={styles["edit-menu"]} onClick={(e) => e.stopPropagation()}>
                    <Title  className={styles["edit-title"]}>
                        Do you really want to delete this playlist?
                    </Title>
                    <div className={styles["edit-button-container"]}>
                        <TextButton onClick={() => setIsOpen(false)}>
                            <Subtitle className={styles["edit-button-text"]}>
                                Cancel
                            </Subtitle>
                        </TextButton>
                        <FilledButton onClick={async () => await handleDelete()}>
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