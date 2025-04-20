import { FC } from "react"
import { Outlet } from "react-router";
import { Player } from "widgets/Player";
import { Bounce, ToastContainer } from "react-toastify";
import { MobileNavbar } from "shared/ui";
import { useTheme } from "entities/theme";
import { DesktopNavbar } from "widgets/DesktopNavbar";
import { LibrarySidebar } from "widgets/LibrarySidebar";
import styles from "./style.module.scss";


export const Layout: FC = () => {
    const { theme } = useTheme();
    
    return (
        <div className={styles["layout"]} id="layout">
            <DesktopNavbar />
            <LibrarySidebar />
            <main className={styles["layout-container"]}>
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
            <MobileNavbar theme={theme} />
        </div>
    )
}