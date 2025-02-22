import { FC } from "react"
import { MobileNavbar } from "widgets/MobileNavbar";
import { Outlet } from "react-router";
import { Player } from "widgets/Player";
import "./layout.scss";


export const Layout: FC = () => {
    return (
        <div className="layout">
            <main className="layout-content">
                <Outlet />
            </main>
            <Player />
            <MobileNavbar />
        </div>
    )
}