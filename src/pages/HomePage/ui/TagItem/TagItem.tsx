import { FC } from "react";
import "./TagItem.scss";
import { Text } from "shared/ui";
import { TFeedFilter } from "entities/feed";
import clsx from "clsx";

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
        <div className={clsx("tag", active && "active")} onClick={handleClick}>
            <Text>
                {tag}
            </Text>
        </div>
    )
}