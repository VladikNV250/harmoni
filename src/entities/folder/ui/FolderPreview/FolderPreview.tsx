import { FC } from "react";
import styles from "./style.module.scss";
import { IFolder } from "../../model/type";
import { PlaceholderFolderImage } from "shared/assets";
import { Text } from "shared/ui";
import { useNavigate } from "react-router";

interface IFolderPreview {
    folder: IFolder
}

export const FolderPreview: FC<IFolderPreview> = ({ folder }) => {
    const { items, name, id } = folder;
    const navigate = useNavigate();
    
    return (
        <div className={styles["folder"]} onClick={() => navigate(`/folders/${id}`)}>
            <div className={styles["folder-image__back"]} />
            <img 
                src={PlaceholderFolderImage} 
                className={styles["folder-image"]} 
            />
            <div className={styles["folder-body"]}>
                <div className={styles["folder-header"]}>
                    <Text className={styles["folder-name"]}>
                        {name ?? ""}
                    </Text>
                    <Text className={styles["folder-total"]}>
                        {`${items.length ?? ""}`}
                    </Text>
                </div>
            </div>
        </div>
    )
}