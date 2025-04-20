import { 
    ChangeEvent, 
    FC, 
    useEffect, 
    useState 
} from "react";
import { 
    Description, 
    FilledButton, 
    Input, 
    Modal, 
    Subtitle 
} from "shared/ui";
import { useAppDispatch } from "shared/lib";
import { librarySlice } from "features/library";
import styles from "./style.module.scss";

interface IEditMenu {
    readonly id: string;
    readonly name: string;
    readonly isOpen: boolean;
    readonly setIsOpen: (isOpen: boolean) => void;
}

export const EditMenu: FC<IEditMenu> = ({ id, name, setIsOpen, isOpen }) => {
    const [value, setValue] = useState(name);
    const dispatch = useAppDispatch();
    const { changeFolderName } = librarySlice.actions;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(value);
    }

    const saveChanges = () => {
        setIsOpen(false);
        dispatch(changeFolderName({id, newName: value}));
    }

    useEffect(() => {
        setValue(name)
    }, [name])

    return (
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={styles["edit-wrapper"]}>
                <div className={styles["edit-menu"]} onClick={(e) => e.stopPropagation()}>
                    <Subtitle className={styles["edit-title"]}>
                        Folder Name
                    </Subtitle>
                    <div className={styles["edit-container"]}>
                        <Input 
                            onChange={handleChange}
                            value={value}   
                        />
                        <FilledButton className={styles["edit-button"]} onClick={saveChanges}>
                            <Description className="edit-button-text">
                                Save changes
                            </Description>
                        </FilledButton>
                    </div>
                </div>
            </div>        
        </Modal>
    )
}