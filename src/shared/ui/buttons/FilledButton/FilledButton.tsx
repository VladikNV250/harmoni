import {
    FC,
    ButtonHTMLAttributes,
} from "react";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IFilledButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Additional styles */
    readonly className?: string;
    /** Children elements */
    readonly children?: JSX.Element | JSX.Element[] | string;
}

export const FilledButton: FC<IFilledButton> = (props) => {
    const {
        className,
        children,
        onClick,
        type,
    } = props;

    return (
        <button
            type={type ?? "button"}
            className={clsx(styles["button-filled"], className)}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
