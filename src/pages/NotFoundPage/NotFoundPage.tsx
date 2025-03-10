import { FC } from "react";
import { Title } from "shared/ui";
import styles from "./style.module.scss"
import { Link } from "react-router";

export const NotFoundPage: FC = () => {
    return (
        <div className={styles["not-found"]}>
            <Title className={styles["not-found-title"]}>
                Error 404. Page Not Found
            </Title>
            <Link to={"/"} className={styles["not-found-link"]}>
                Back to Home 
            </Link>
        </div>
    )
}