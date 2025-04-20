import { CSSProperties, FC } from "react";
import { Link } from "react-router";
import { Title } from "shared/ui";
import { PlaceholderImage } from "shared/assets";
import { ICategory } from "shared/api/category";
import styles from "./style.module.scss"
import { useColor } from "shared/lib";

interface IBrowseCategory {
    readonly category: ICategory
}

export const BrowseCategory: FC<IBrowseCategory> = ({ category }) => {
    const { name, icons, id } = category;
    const color = useColor(icons?.[0].url || PlaceholderImage, false);

    return (
        <Link
            to={`/categories/${id}`} 
            className={styles["browse-category"]} 
            style={{"--color": color} as CSSProperties}
        >
            <Title className={styles["category-title"]}>
                {name ?? ""}
            </Title>
            <img 
                src={icons?.[0]?.url || PlaceholderImage} 
                className={styles['category-image']} 
            />
        </Link>
    )
}