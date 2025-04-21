import {
    FC,
    ButtonHTMLAttributes,
} from "react";
import clsx from "clsx";
import styles from "./style.module.scss";


interface ITextButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Additional styles */
    readonly className?: string;
    /** Children elements */
    readonly children?: JSX.Element | JSX.Element[] | string;
}

export const TextButton: FC<ITextButton> = (props) => {
    const {
        className,
        children,
        onClick,
        type,
    } = props;

    return (
        <button
            type={type ?? "button"}
            className={clsx(styles["button-text"], className)}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
