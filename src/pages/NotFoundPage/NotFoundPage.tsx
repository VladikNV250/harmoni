import { FC } from "react";
import { Title } from "shared/ui";
import { Link } from "react-router";
import styles from "./style.module.scss"

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