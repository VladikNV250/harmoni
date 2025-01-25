import { FC } from "react"
import { MobileNavbar } from "widgets/MobileNavbar";
import "./layout.scss";
import { Outlet } from "react-router";

export const Layout: FC = () => {
    return (
        <div className="layout">
            <main className="layout-content">
                <Outlet />
            </main>
            <MobileNavbar />
        </div>
    )
}