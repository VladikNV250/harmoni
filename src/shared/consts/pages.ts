import { INavLinkType } from "shared/types/navLinkTypes";
import Home from "shared/assets/icons/home-big.svg?react";
import HomeFilled from "shared/assets/icons/home-big__filled.svg?react";
import Search from "shared/assets/icons/search-big.svg?react";
import SearchFilled from "shared/assets/icons/search-big__filled.svg?react";
import Library from "shared/assets/icons/library-big.svg?react";
import LibraryFilled from "shared/assets/icons/library-big__filled.svg?react";
import User from "shared/assets/icons/user-big.svg?react";
import UserFilled from "shared/assets/icons/user-big__filled.svg?react";

export const NAVIGATION_LINKS: INavLinkType[] = [
    {
        title: "Home", href: "",
        Icon: Home, ActiveIcon: HomeFilled,
    },
    {
        title: "Search", href: "search",
        Icon: Search, ActiveIcon: SearchFilled,
    },
    {
        title: "My Library", href: "library",
        Icon: Library, ActiveIcon: LibraryFilled,
    },
    {
        title: "Me", href: "profile",
        Icon: User, ActiveIcon: UserFilled,
    },
]