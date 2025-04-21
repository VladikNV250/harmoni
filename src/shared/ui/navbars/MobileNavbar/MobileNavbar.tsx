import { FC } from "react";
import { NavLink } from "react-router";
import { INavLinkType } from "shared/types";
import { Text } from "shared/ui";
import { NAVIGATION_LINKS_MOBILE } from "shared/consts";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IMobileNavbar {
    /** Additional styles */
    readonly className?: string
    /** Theme */
    readonly theme?: string;
}

export const MobileNavbar: FC<IMobileNavbar> = ({ className, theme }) => {
    const renderNavLinks = (navLinks: INavLinkType[]) => {
        return navLinks.map(({ title, href, Icon, ActiveIcon }) => (
            <li key={href} className={styles["list-item"]}>
                <NavLink
                    to={`/${href}`}
                    className={({ isActive }) =>
                        `${styles["item-link"]} ${isActive ? styles["active"] : ""}`
                    }
                >
                    <Icon width={40} height={40} className={styles["item-icon"]} />
                    <ActiveIcon width={40} height={40} className={styles["item-active-icon"]} />
                    <Text className={styles["item-title"]}>
                        {title}
                    </Text>
                </NavLink>
            </li>
        ))
    }

    return (
        <nav
            className={clsx(
                styles["mobile-navbar"],
                theme && styles[theme],
                className,
            )}
        >
            <ul className={styles["navbar-list"]}>
                {renderNavLinks(NAVIGATION_LINKS_MOBILE)}
            </ul>
        </nav>
    )
}