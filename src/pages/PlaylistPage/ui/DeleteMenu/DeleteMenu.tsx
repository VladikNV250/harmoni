import { FC } from "react";
import { useNavigate } from "react-router";
import { getLibraryPlaylists } from "features/library";
import {
    FilledButton,
    Modal,
    Subtitle,
    TextButton,
    Title
} from "shared/ui";
import {
    IPlaylist,
    unfollowPlaylist
} from "shared/api/playlist";
import { useAppDispatch } from "shared/lib";
import { toast } from "react-toastify";
import styles from "./style.module.scss";

interface IDeleteMenu {
    /** Id of the playlist that can be deleted */
    readonly id: IPlaylist["id"];
    /** Controls whether menu is visible */
    readonly isOpen: boolean;
    /** Callback toggle the menu's visibility.  */
    readonly setIsOpen: (isOpen: boolean) => void;
    /** Called when user confirm deleting of playlist. */
    readonly onDelete?: () => void;
}

/**
 * @component DeleteMenu
 * @description Confirmation modal for deleting a user's playlist.
 */
export const DeleteMenu: FC<IDeleteMenu> = ({ id, isOpen, setIsOpen, onDelete }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        try {
            onDelete?.();
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
            <div className={styles["delete-wrapper"]}>
                <div className={styles["delete-menu"]} onClick={(e) => e.stopPropagation()}>
                    <Title className={styles["delete-title"]}>
                        Do you really want to delete this playlist?
                    </Title>
                    <div className={styles["delete-button-container"]}>
                        <TextButton onClick={() => setIsOpen(false)}>
                            <Subtitle className={styles["delete-button-text"]}>
                                Cancel
                            </Subtitle>
                        </TextButton>
                        <FilledButton onClick={async () => await handleDelete()}>
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