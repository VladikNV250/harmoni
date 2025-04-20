import { INavLinkType } from "shared/types/navLinkTypes";
import { 
    HomeFilled, 
    HomeIcon, 
    LibraryFilled, 
    LibraryIcon, 
    SearchFilled, 
    SearchIcon, 
    UserFilled, 
    UserIcon 
} from "shared/assets";


export const NAVIGATION_LINKS_MOBILE: INavLinkType[] = [
    {
        title: "Home", href: "",
        Icon: HomeIcon, ActiveIcon: HomeFilled,
    },
    {
        title: "Search", href: "search",
        Icon: SearchIcon, ActiveIcon: SearchFilled,
    },
    {
        title: "My Library", href: "library",
        Icon: LibraryIcon, ActiveIcon: LibraryFilled,
    },
    {
        title: "Me", href: "profile",
        Icon: UserIcon, ActiveIcon: UserFilled,
    },
]