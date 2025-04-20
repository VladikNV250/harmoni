import { 
    ChangeEvent, 
    FC, 
    InputHTMLAttributes, 
    useState 
} from "react";
import { SearchIcon } from "shared/assets";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IExpandableSearchInput extends InputHTMLAttributes<HTMLInputElement> {
    /** Additional styles. */
    readonly className?: string,
    /** Direction where input extend */
    readonly direction?: "left" | "right"
}

export const ExpandableSearchInput: FC<IExpandableSearchInput> = (props) => {
    const {
        value,
        onChange,
        placeholder,
        className,
        direction,
    } = props;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [inputData, setInputData] = useState<string>("");
    
    const onChangeInputData = (e: ChangeEvent<HTMLInputElement>) => {
        setInputData(e.target.value);
    }
    
    return (
        <div className={clsx(
            styles["input-container"], 
            className,
            isOpen && styles["opened"],
            direction === "left" ? styles["left"] : styles["right"],
        )}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    styles["input-button"],
                    direction === "left" ? styles["left"] : styles["right"],
                    isOpen && styles["opened"]
                )} 
            >
                <SearchIcon width={40} height={40} className={styles["input-icon"]} />
            </button>
            <input 
                type="text" 
                className={clsx(
                    styles["input"],
                    direction === "left" ? styles["left"] : styles["right"],
                    isOpen && styles["opened"]
                )}
                value={value ?? inputData}
                placeholder={placeholder}
                onChange={onChange ?? onChangeInputData}
            />
        </div>
    )
}