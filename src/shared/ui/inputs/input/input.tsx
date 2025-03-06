import clsx from "clsx";
import { ChangeEvent, FC, InputHTMLAttributes, useState } from "react";
import styles from "./style.module.scss";


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
        <div className={clsx(styles["input-container"], className)}>
            <input 
                type="text" 
                className={styles["input"]}
                value={value ?? inputData}
                placeholder={placeholder}
                onChange={onChange ?? onChangeInputData}
            />
        </div>
        
    )
}