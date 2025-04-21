import { 
    ChangeEvent, 
    FC, 
    useEffect, 
    useState 
} from "react";
import { librarySlice } from "features/library";
import { 
    Description, 
    FilledButton, 
    Input, 
    Modal, 
    Subtitle 
} from "shared/ui";
import { useAppDispatch } from "shared/lib";
import styles from "./style.module.scss";

interface IEditMenu {
    /** Id of the folder that can be edited */
    readonly id: string;
    /** Current folder name */
    readonly name: string;
    /** Controls whether menu is visible */
    readonly isOpen: boolean;
    /** Callback to toggle the menu's visibility */
    readonly setIsOpen: (isOpen: boolean) => void;
}

/**
 * @component EditMenu
 * @description Modal dialog that allows editing the name of a folder.
 */
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