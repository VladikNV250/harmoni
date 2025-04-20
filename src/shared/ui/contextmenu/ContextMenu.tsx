import { FC, ReactNode } from "react";
import styles from "./style.module.scss";
import clsx from "clsx";
import { MenuButton } from "../buttons/MenuButton/MenuButton";
import { LeftIcon } from "shared/assets";


interface IContextMenu {
    /** Additional styles */
    readonly className?: string;
    readonly isMenuOpen: boolean;
    readonly setIsMenuOpen: (state: boolean) => void;
    readonly isNested?: boolean;
    readonly hasNested?: boolean;
    readonly hideMainContent?: boolean;
    readonly additionalElements?: ReactNode;
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
            onMouseLeave={isNested ? () => {} : () => setIsMenuOpen(false)}
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