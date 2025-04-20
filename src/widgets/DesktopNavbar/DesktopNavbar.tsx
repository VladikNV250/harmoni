import { 
    ChangeEvent, 
    FC 
} from "react";
import { 
    Link, 
    NavLink 
} from "react-router";
import { 
    HomeFilled, 
    HomeIcon, 
    PlaceholderProfileImage, 
    SearchIcon 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    searchSlice, 
    selectSearchQuery 
} from "features/search";
import { Description } from "shared/ui";
import { selectUser } from "entities/user";
import { librarySlice } from "features/library";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IDesktopNavbar {
    /** Additional styles */
    readonly className?: string
}

export const DesktopNavbar: FC<IDesktopNavbar> = ({ className }) => {
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();
    const query = useAppSelector(selectSearchQuery);
    const { setQuery } = searchSlice.actions;
    const { setFilter } = librarySlice.actions;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        dispatch(setQuery(value));
    }    

    return (
        <nav 
            className={clsx(
                styles["desktop-navbar"], 
                className, 
            )}
        >
            <ul className={styles["navbar-list"]}>
                <li className={styles["list-item"]}>
                    <NavLink
                        to={`/`}
                        className={({isActive}) => 
                            `${styles["item-link"]} ${isActive ? styles["active"] : ""}`
                        }
                        onClick={() => dispatch(setFilter("all"))}
                    >
                        <HomeIcon width={40} height={40} className={styles["item-icon"]} />
                        <HomeFilled width={40} height={40} className={styles["item-active-icon"]} />
                        <Description className={styles["item-title"]}>
                            Home
                        </Description>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to={`/search`}
                        className={({isActive}) => 
                            `${styles["search-link"]} ${isActive ? styles["active"] : ""}`
                        }
                        onClick={() => dispatch(setFilter("all"))}
                    >
                        <SearchIcon width={40} height={40} className={styles["search-icon"]} />
                        <input 
                            type="text" 
                            className={styles["search-input"]}
                            value={query}
                            placeholder={"Search"}
                            onChange={handleChange}
                        />
                    </NavLink>
                </li>
            </ul>
            <Link 
                to={`/profile`} 
                className={styles["profile-link"]} 
                onClick={() => dispatch(setFilter("all"))}
            >
                <img src={user?.images?.[0]?.url ?? PlaceholderProfileImage} />
            </Link>
        </nav>
    )
}