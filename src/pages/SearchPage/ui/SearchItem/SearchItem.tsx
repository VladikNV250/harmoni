import { FC } from "react";
import { PlaceholderImage } from "shared/assets";
import clsx from "clsx";
import { useNavigate } from "react-router";
import styles from "./style.module.scss";


interface ISearchItem {
    readonly type: "album" | "artist" | "track" | "show" | "episode" | "playlist",
    readonly link: string,
    readonly image: string,
    readonly content: React.ReactNode,
    readonly button: React.ReactNode,
}

export const SearchItem: FC<ISearchItem> = ({ type, link, image, content, button }) => {
    const navigate = useNavigate();
    
    return (
        <div className={styles["search-item"]} onClick={() => navigate(link)}>
            <img 
                src={image || PlaceholderImage} 
                className={clsx(
                    type === "artist" 
                        ? styles["search-item-image-circle"]
                        : styles["search-item-image"]
                )} 
            />
            <div className={styles["search-item-body"]}>
                {content}
            </div>            
            {button}
        </div>
    )
}