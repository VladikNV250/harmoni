import { FC } from "react";
import styles from "./style.module.scss";


interface ISwitch {
    /** Show state of Switch (ON or OFF) */
    readonly active?: boolean;
    /** Function to change the active state */
    readonly setActive?: (active: boolean) => void;
    /** Disable switch */
    readonly disabled?: boolean;
}

export const Switch: FC<ISwitch> = ({ active = false, setActive, disabled }) => {

    const handleChange = () => {
        setActive?.(!active);
    }

    return (
        <label 
            className={styles["switch"]} 
            onClick={!disabled ? handleChange : () => {}}>
            <input 
                type="checkbox" 
                checked={active && !disabled} 
                onClick={(e) => e.stopPropagation()} 
                readOnly
            />
            <div className={styles["slider"]} />
        </label>
    )
}
