import { FC } from "react";
import "./switch.scss";

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
            className="switch" 
            onClick={!disabled ? handleChange : () => {}}>
            <input 
                type="checkbox" 
                checked={active} 
                onClick={(e) => e.stopPropagation()} 
                readOnly
            />
            <div className="slider"/>
        </label>
    )
}