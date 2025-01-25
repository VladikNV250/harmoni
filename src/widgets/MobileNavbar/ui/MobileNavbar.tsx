import clsx from "clsx";
import { useTheme } from "entities/theme";
import { FC } from "react";
import { NavLink } from "react-router";
import { NAVIGATION_LINKS } from "shared/consts";
import { INavLinkType } from "shared/types";
import "./MobileNavbar.scss";
import { Text } from "shared/ui";

export const MobileNavbar: FC = () => {
    const { theme } = useTheme();

    const renderNavLinks = (navLinks: INavLinkType[]) => {
        return navLinks.map(({ title, href, Icon, ActiveIcon }) => (
            <li key={href} className="list-item">
                <NavLink
                    to={`/${href}`}
                    className={
                        ({isActive}) => "item-link" + (isActive ? "__active" : "")}>
                    <Icon width={40} height={40} className="item-icon" />
                    <ActiveIcon width={40} height={40} className="item-active-icon" />
                    <Text className="item-title">{title}</Text>
                </NavLink>
            </li>
        ))
    }

    return (
        <nav className={clsx("mobile-navbar", theme)}>
            <ul className="navbar-list">
                {renderNavLinks(NAVIGATION_LINKS)}
            </ul>
        </nav>
    )
}