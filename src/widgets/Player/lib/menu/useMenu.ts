import { useState } from "react";

export const useMenu = (defaulMenus: { [key: string]: boolean }) => {
    const [openedMenus, setOpenedMenus] = useState(defaulMenus);

    const openMenu = (whatOpen: string, openState?: boolean) => {
        setOpenedMenus(prevState => ({
            ...prevState,
            [whatOpen]: openState !== undefined ? openState : !prevState[whatOpen],
        }))
    }  

    return { menus: openedMenus, openMenu }    
}