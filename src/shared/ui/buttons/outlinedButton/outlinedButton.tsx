import { ButtonHTMLAttributes, FC } from "react";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IOutlinedButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Additional styles */
    readonly className?: string;
    /** Children elements */
    readonly children?: JSX.Element | JSX.Element[] | string;
}

export const OutlinedButton: FC<IOutlinedButton> = (props) => {
    const { 
        className, 
        children,
        onClick,
        type, 
    } = props;
    
    return (
        <button 
            type={type ?? "button"}
            className={clsx(styles["button-outlined"], className)}
            onClick={onClick}
        >
            {children}
        </button>
    )
}