import { FC } from "react";
import "./TagItem.scss";
import { Text } from "shared/ui";

interface ITagItem {
    tag: string,
}

export const TagItem: FC<ITagItem> = ({ tag }) => {
    return (
        <div className="tag">
            <Text>
                {tag}
            </Text>
        </div>
    )
}