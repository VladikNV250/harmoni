import { FC } from "react"
import { MobileNavbar } from "widgets/MobileNavbar";
import { Outlet } from "react-router";
import { Player } from "widgets/Player";
import styles from "./style.module.scss";
import { Bounce, ToastContainer } from "react-toastify";

export const Layout: FC = () => {
    return (
        <div className={styles["layout"]}>
            <main>
                <ToastContainer
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover={false}
                    theme="colored"
                    transition={Bounce}
                />
                <Outlet />
            </main>
            <Player />
            <MobileNavbar />
        </div>
    )
}