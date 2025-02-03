import clsx from "clsx";
import { ChangeEvent, FC, InputHTMLAttributes, useState } from "react";
import Search from "shared/assets/icons/search-big.svg?react";
import "./input.scss";

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
    /** Additional styles. */
    readonly className?: string,
}

export const Input: FC<IInput> = (props) => {
    const {
        value,
        onChange,
        placeholder,
        className,
    } = props;
    const [inputData, setInputData] = useState<string>("");
    
    const onChangeInputData = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    }
    
    return (
        <div className={clsx("input-container", className)}>
            <input 
                type="text" 
                className="input"
                value={value ?? inputData}
                placeholder={placeholder}
                onChange={onChange ?? onChangeInputData}
            />
            <Search width={35} height={35} className="input-icon" />
        </div>
        
    )
}