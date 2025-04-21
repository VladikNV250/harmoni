import { FC } from "react"
import { Outlet } from "react-router";
import {
    Bounce,
    ToastContainer
} from "react-toastify";
import { Player } from "widgets/Player";
import { DesktopNavbar } from "widgets/DesktopNavbar";
import { LibrarySidebar } from "widgets/LibrarySidebar";
import { useTheme } from "entities/theme";
import { MobileNavbar } from "shared/ui";
import styles from "./style.module.scss";

/**
 * @component Layout
 * @description
 * Main layout for entire application. It has navbars, sidebar and outlet for rendering pages.
 * id="layout" is used as root-container for modals with React Portal (createPortal)  
 */
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