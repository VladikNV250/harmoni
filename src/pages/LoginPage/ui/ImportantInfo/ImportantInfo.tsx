import { FC } from "react";
import { 
    Modal, 
    Subtitle, 
} from "shared/ui";
import styles from "./style.module.scss";

interface IImportantInfo {
    /** Controls whether the menu is visible. */
    readonly isOpen: boolean,
    /** Callback to toggle the menu's visibility. */
    readonly setIsOpen: (state: boolean) => void;
}

export const ImportantInfo: FC<IImportantInfo> = ({ isOpen, setIsOpen }) => {
    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={styles["info-wrapper"]}>
                <div className={styles["info-menu"]} onClick={(e) => e.stopPropagation()}>
                    <p className={styles["info-text"]}>
                        In order to log in, you need an email that is registered in application.
                        To register the email, you can contact with developer via vladiknemichev@gmail.com
                        (or other contact information listed in repository of project on GitHub) with a
                        request to provide access. Unfortunately, this is the procedure for authorization
                        through Spotify. I apologize for this inconvenience. I also recommend having a Spotify
                        account with a premium status to get access all the features of the application.<br />
                        I wish you a pleasent experience!<br />
                        <br />
                        Yours sincerely,<br />
                        Developer
                    </p>
                    <button className={styles["info-button"]} onClick={() => setIsOpen(false)}>
                        <Subtitle>
                            Close
                        </Subtitle>
                    </button>
                </div>
            </div>
        </Modal>
    )
}