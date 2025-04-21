import { 
    FC, 
    useState 
} from "react";
import { getAuthURL } from "shared/api/authorization";
import {
    OutlinedButton,
    Subtitle,
    Title
} from "shared/ui";
import { HarmoniLogo } from "shared/assets";
import { ImportantInfo } from "../ImportantInfo/ImportantInfo";
import styles from "./style.module.scss"

export const LoginPage: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleAuthorize = async () => {
        const authURL = await getAuthURL();
        window.location.href = authURL;
    }

    return (
        <div className={styles["login"]}>
            <ImportantInfo 
                isOpen={isOpen} 
                setIsOpen={setIsOpen} 
            />
            <img
                src={HarmoniLogo}
                alt="Harmoni"
                height={60}
                className={styles["logo"]}
            />
            <div className={styles["login-body"]}>
                <Title className={styles["login-title"]}>
                    You don't authorize to App
                </Title>
                <button className={styles["login-button"]} onClick={handleAuthorize}>
                    Log In
                </button>
            </div>
            <OutlinedButton onClick={() => setIsOpen(true)}>
                <Subtitle>
                    Important information!
                </Subtitle>
            </OutlinedButton>
        </div>
    )
}