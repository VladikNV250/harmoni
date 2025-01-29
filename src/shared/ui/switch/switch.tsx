import { FC } from "react";
import "./switch.scss";

interface ISwitch {
    /** Show state of Switch (ON or OFF) */
    readonly active?: boolean;
    /** Function to change the active state */
    readonly setActive?: (active: boolean) => void;
}

export const Switch: FC<ISwitch> = ({ active = false, setActive }) => {

    return (
        <label className="switch" onClick={() => setActive?.(!active)}>
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