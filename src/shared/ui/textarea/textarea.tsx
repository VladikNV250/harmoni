import clsx from "clsx";
import { ChangeEvent, FC, InputHTMLAttributes, useState } from "react";
import styles from "./style.module.scss";


interface ITextArea extends InputHTMLAttributes<HTMLTextAreaElement> {
    /** Additional styles. */
    readonly className?: string,
}

export const TextArea: FC<ITextArea> = (props) => {
    const {
        name,
        value,
        onChange,
        placeholder,
        className,
    } = props;
    const [inputData, setInputData] = useState<string>("");
    
    const onChangeInputData = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputData(e.target.value);
    }
    
    return (
        <div className={clsx(styles["textarea-container"], className)}>
            <textarea 
                className={styles["textarea"]}
                name={name}
                value={value ?? inputData}
                placeholder={placeholder}
                onChange={onChange ?? onChangeInputData}
            />
        </div>
        
    )
}