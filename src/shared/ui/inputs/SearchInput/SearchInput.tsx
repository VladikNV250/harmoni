import {
    ChangeEvent,
    FC,
    InputHTMLAttributes,
    useState
} from "react";
import { SearchIcon } from "shared/assets";
import clsx from "clsx";
import styles from "./style.module.scss";


interface ISearchInput extends InputHTMLAttributes<HTMLInputElement> {
    /** Additional styles. */
    readonly className?: string,
}

export const SearchInput: FC<ISearchInput> = (props) => {
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
            <SearchIcon width={35} height={35} className={styles["input-icon"]} />
        </div>

    )
}
