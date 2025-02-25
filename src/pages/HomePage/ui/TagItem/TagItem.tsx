import { FC } from "react";
import { Text } from "shared/ui";
import { TFeedFilter } from "entities/feed";
import clsx from "clsx";
import styles from "./style.module.scss";

interface ITagItem {
    readonly tag: string,
    readonly active: boolean,
    readonly setType: (type?: TFeedFilter) => void
}

export const TagItem: FC<ITagItem> = ({ tag, active, setType }) => {

    const handleClick = () => {
        if (active) setType("all");
        else setType();
    }

    return (
        <div 
            onClick={handleClick}
            className={clsx(
                styles["tag"], 
                active && styles["active"]
            )} 
        >
            <Text>
                {tag}
            </Text>
        </div>
    )
}