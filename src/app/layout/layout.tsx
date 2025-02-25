import { FC } from "react"
import { MobileNavbar } from "widgets/MobileNavbar";
import { Outlet } from "react-router";
import { Player } from "widgets/Player";
import styles from "./style.module.scss";

export const Layout: FC = () => {
    return (
        <div className={styles["layout"]}>
            <main>
                <Outlet />
            </main>
            <Player />
            <MobileNavbar />
        </div>
    )
}