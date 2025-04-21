import {
    FC,
    ReactNode
} from "react";
import { LeftIcon } from "shared/assets";
import { MenuButton } from "../buttons/MenuButton/MenuButton";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IContextMenu {
    /** Additional styles */
    readonly className?: string;
    /** Controls whether the menu is visible. */
    readonly isMenuOpen: boolean;
    /** Callback to toggle the menu's visibility. */
    readonly setIsMenuOpen: (state: boolean) => void;
    /** Controls whether the menu is nested in other menu. */
    readonly isNested?: boolean;
    /** Controls whether the menu has other nested menus. */
    readonly hasNested?: boolean;
    /** Controls when hide main content. Typically used when the menu has other nested menus. */
    readonly hideMainContent?: boolean;
    /** 
     * Additional elements that is not contained in main content. 
     * Typically used when we need add nested menus or buttons outside the main content.
     */
    readonly additionalElements?: ReactNode;
    /** Main content that will be displayed in the menu. */
    readonly children?: ReactNode;
}

export const ContextMenu: FC<IContextMenu> = (props) => {
    const {
        isMenuOpen,
        setIsMenuOpen,
        className,
        isNested = false,
        hasNested = false,
        hideMainContent = false,
        additionalElements,
        children
    } = props

    return (
        <div
            className={clsx(
                styles["context-menu"],
                isNested && styles["slideable"],
                hasNested && styles["grid"],
                isMenuOpen && styles["opened"],
                className
            )}
            onClick={e => e.stopPropagation()}
            onMouseLeave={isNested ? () => { } : () => setIsMenuOpen(false)}
        >
            {isNested &&
                <MenuButton
                    Icon={LeftIcon}
                    text="Back"
                    onClick={() => setIsMenuOpen(false)}
                />}
            {additionalElements}
            <div
                className={clsx(
                    styles["context-menu-content"],
                    hideMainContent && styles["hidden"]
                )}
            >
                {children}
            </div>
        </div>
    )
}