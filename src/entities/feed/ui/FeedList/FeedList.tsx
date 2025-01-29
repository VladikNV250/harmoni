import { FC } from "react";
import PinIcon from "shared/assets/icons/pin-big.svg?react";
// import MoveIcon from "shared/assets/icons/move-big.svg?react";
import UpIcon from "shared/assets/icons/up-big.svg?react";
import DownIcon from "shared/assets/icons/down-big.svg?react";
import ShowIcon from "shared/assets/icons/show-big.svg?react";
import HideIcon from "shared/assets/icons/show-big__filled.svg?react";
import { Description } from "shared/ui";
import clsx from "clsx";
import "./FeedList.scss";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { selectFeeds } from "entities/feed/model/selectors";
import { IFeed } from "entities/feed/model/types";
import { feedSlice } from "entities/feed/model/feedSlice";

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
                    className={clsx("item-feed", (feed.hidden.isHidden || feed.items.length === 0) && "hidden")}
                    style={{order: feed.order}}>
                    <button 
                        className="item-button" 
                        onClick={() => dispatch(pinFeed(feedName))}
                        >
                        <PinIcon
                            width={40} height={40}
                            className={clsx("icon", feed.order < 0 && "active")}
                        />
                    </button>
                    <Description className="item-name">
                        {feedName}
                    </Description>
                    <button className="item-button" onClick={() => dispatch(moveUpFeed(feedName))} >
                        <UpIcon width={40} height={40} />
                    </button>
                    <button className="item-button" onClick={() => dispatch(moveDownFeed(feedName))} >
                        <DownIcon width={40} height={40} />
                    </button>
                    <button 
                        className="item-button"
                        onClick={() => dispatch(hideFeed(feedName))}
                        disabled={feed.items.length === 0 || feed.hidden.locked}
                        >
                        {(!feed.hidden.isHidden && feed.items.length > 0)
                            ? <ShowIcon width={40} height={40} />
                            : <HideIcon width={40} height={40} />}
                    </button>
                </li>
            )
        })
    }

    return (
        <ul className="feed-list">
            {renderFeedItems(feeds)}
        </ul>
    )
}