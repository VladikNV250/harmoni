import { FC } from "react";
import { Link } from "react-router";
import { Title } from "shared/ui";
import { PlaceholderImage } from "shared/assets";
import { ICategory } from "shared/api/category";
import styles from "./style.module.scss"

interface IBrowseCategory {
    readonly category: ICategory
}

export const BrowseCategory: FC<IBrowseCategory> = ({ category }) => {
    const { name, icons, id } = category;
    
    return (
        <Link
            to={`/categories/${id}`} 
            className={styles["browse-category"]} 
            style={{background: `url(${icons?.[0].url || PlaceholderImage})`}}
        >
            <Title className={styles["category-title"]}>
                {name ?? ""}
            </Title>
        </Link>
    )
}