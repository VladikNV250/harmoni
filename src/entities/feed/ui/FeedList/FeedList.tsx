import { FC } from "react";
import { Description } from "shared/ui";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { selectFeeds } from "entities/feed/model/selectors";
import { IFeed } from "entities/feed/model/types";
import { feedSlice } from "entities/feed/model/feedSlice";
import { 
    UpIcon, 
    DownIcon, 
    PinIcon, 
    ShowIcon, 
    ShowFilledIcon, 
} from "shared/assets";
import styles from "./style.module.scss";

export const FeedList: FC = () => {
    const feeds = useAppSelector(selectFeeds);
    const dispatch = useAppDispatch();
    const { pinFeed, hideFeed, moveUpFeed, moveDownFeed } = feedSlice.actions;

    const renderFeedItems = (feeds: {
        [key: string]: IFeed
    }) => {
        return Object.keys(feeds).map((feedName, index) => {
            const feed = feeds[feedName];
            return (
                <li 
                    key={index} 
                    className={clsx(
                        styles["item-feed"], 
                        (feed.hidden.isHidden || feed.items.length === 0) && styles["hidden"]
                    )}
                    style={{order: feed.order}}
                >
                    <button 
                        className={styles["item-button"]} 
                        onClick={() => dispatch(pinFeed(feedName))}
                        >
                        <PinIcon
                            width={40} height={40}
                            className={clsx(
                                styles["icon"], 
                                feed.order < 0 && styles["active"]
                            )}
                        />
                    </button>
                    <Description className={styles["item-name"]}>
                        {feedName}
                    </Description>
                    <button 
                        className={styles["item-button"]} 
                        onClick={() => dispatch(moveUpFeed(feedName))} 
                    >
                        <UpIcon width={40} height={40} />
                    </button>
                    <button 
                        className={styles["item-button"]} 
                        onClick={() => dispatch(moveDownFeed(feedName))} 
                    >
                        <DownIcon width={40} height={40} />
                    </button>
                    <button 
                        className={styles["item-button"]}
                        onClick={() => dispatch(hideFeed(feedName))}
                        disabled={feed.items.length === 0 || feed.hidden.locked}
                    >
                        {(!feed.hidden.isHidden && feed.items.length > 0)
                            ? <ShowIcon width={40} height={40} />
                            : <ShowFilledIcon width={40} height={40} />}
                    </button>
                </li>
            )
        })
    }

    return (
        <ul className={styles["feed-list"]}>
            {renderFeedItems(feeds)}
        </ul>
    )
}