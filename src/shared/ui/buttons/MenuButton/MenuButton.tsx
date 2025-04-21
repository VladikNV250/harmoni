import {
    FC,
    ButtonHTMLAttributes,
    MouseEventHandler
} from "react";
import { Link } from "react-router";
import { TIconComponent } from "shared/types";
import { Paragraph } from "shared/ui/typography/paragraph";
import { RightIcon } from "shared/assets";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IMenuButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Additional styles */
    readonly className?: string;
    /** The text to be displayed on the menu button. */
    readonly text: string;
    /** Icon displayed next to the menu button text. */
    readonly Icon: TIconComponent;
    /** Indicates whether the menu button has a nested menu. */
    readonly hasNestedMenu?: boolean;
    /** Indicates whether the menu button is currently active. */
    readonly isActive?: boolean;
    /** Type of button */
    readonly buttonType?: "button" | "link-button";
    /** Href for link-button */
    readonly to?: string;
}

export const MenuButton: FC<IMenuButton> = (props) => {
    const {
        className,
        onClick,
        disabled,
        Icon,
        text,
        hasNestedMenu = false,
        isActive = false,
        buttonType = "button",
        to,
    } = props;

    return (
        buttonType === "link-button"
            ?
            <Link
                to={disabled ? "" : (to ?? "")}
                className={clsx(
                    styles["menu-link"],
                    disabled && styles["disabled"],
                    className
                )}
                onClick={disabled ? () => { } : onClick as MouseEventHandler}
            >
                <Icon width={40} height={40} />
                <Paragraph>
                    {text}
                </Paragraph>
            </Link>
            :
            <button
                type={"button"}
                className={clsx(
                    styles["menu-button"],
                    className
                )}
                onClick={onClick}
                onMouseLeave={e => e.stopPropagation()}
                disabled={disabled ?? false}
            >
                <Icon
                    width={40}
                    height={40}
                    className={clsx(isActive && styles['active'])}
                />
                <Paragraph>
                    {text}
                </Paragraph>
                {hasNestedMenu && <RightIcon width={40} height={40} />}
            </button>
    )
}