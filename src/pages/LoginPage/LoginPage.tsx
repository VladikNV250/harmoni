import { FC } from "react";
import { getAuthURL } from "shared/api/authorization";
import { Title } from "shared/ui";
import styles from "./style.module.scss"

export const LoginPage: FC = () => {
    const handleAuthorize = async () => {
        const authURL = await getAuthURL();
        window.location.href = authURL;
    }
    
    return (
        <div className={styles["login"]}>
            <Title className={styles["login-title"]}>
                You don't authorize to App
            </Title>
            <button className={styles["login-button"]} onClick={handleAuthorize}>
                Log In
            </button>
        </div>
    )
}