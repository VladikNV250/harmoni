import { FC } from "react";
import { NavLink, useLocation } from "react-router";
import { Description } from "shared/ui";
import { 
    LibraryFilled, 
    LibraryIcon, 
} from "shared/assets";
import { ILibraryFilterOptions } from "../model/types";
import { LIBRARY_FILTER_OPTIONS } from "../consts/library";
import clsx from "clsx";
import styles from "./style.module.scss";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { librarySlice, selectLibraryFilter } from "features/library";


export const LibrarySidebar: FC = () => {
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    const selectedFilter = useAppSelector(selectLibraryFilter);
    const { setFilter } = librarySlice.actions;

    const renderItems = (items: ILibraryFilterOptions[]) => {
        return items.map(({ name, Icon, filter }) =>    
            <li key={name} className={styles["library-navbar-item"]} >
                <NavLink
                    to={`/library`}
                    className={({isActive}) =>
                        `
                         ${styles["library-navbar-item-link"]} 
                         ${isActive && selectedFilter === filter ? styles["active"] : ""}
                        `
                    }
                    onClick={() => dispatch(setFilter(filter))}
                >
                    <Icon width={40} height={40} />
                    <Description>
                        {name}
                    </Description>
                </NavLink>
            </li>
        )
    }

    return (
        <nav className={styles["library-navbar"]}>
            <div className={clsx(
                styles["library-navbar-container"],
                pathname.includes("library") && styles["active"]
            )}>
                <NavLink
                    to={`/library`}
                    className={({isActive}) => 
                        `${styles["library-navbar-link"]} ${isActive ? styles["active"] : ""}`
                    }
                    onClick={() => dispatch(setFilter("all"))}
                >
                    <LibraryIcon width={40} height={40} className={styles["link-icon"]} />
                    <LibraryFilled width={40} height={40} className={styles["link-active-icon"]} />
                    <Description className={styles["link-title"]}>
                        My Library
                    </Description>
                </NavLink>
                <ul className={styles["library-navbar-list"]}>
                    {renderItems(LIBRARY_FILTER_OPTIONS)}
                </ul>
            </div>
        </nav>
    )
}