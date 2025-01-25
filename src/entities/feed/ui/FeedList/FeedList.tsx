import { FC } from "react";
import PinIcon from "shared/assets/icons/pin-big.svg?react";
import MoveIcon from "shared/assets/icons/move-big.svg?react";
import ShowIcon from "shared/assets/icons/show-big.svg?react";
import HideIcon from "shared/assets/icons/show-big__filled.svg?react";
import { Description } from "shared/ui";
import clsx from "clsx";
import "./FeedList.scss";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { selectFeeds } from "entities/feed/model/selectors";
import { feedSlice } from "entities/feed/model/feedSlice";
import { IFeed } from "entities/feed/model/types";

export const FeedList: FC = () => {
    const feeds = useAppSelector(selectFeeds);
    const dispatch = useAppDispatch();
    const {hideFeed, pinFeed} = feedSlice.actions;

    const renderFeedItems = (feeds: IFeed[]) => {
        return feeds.map((feed, index) => 
            <li 
                key={index} 
                className={clsx("item-feed", feed.isHidden && "hidden")}>
                <button 
                    className="item-button" 
                    onClick={() => dispatch(pinFeed({name: feed.name}))}>
                    <PinIcon
                        width={40} height={40}
                        className={clsx("icon", feed.isPined && "active")}
                    />
                </button>
                <Description className="item-name">
                    {feed.name}
                </Description>
                <button className="item-button grab-button">
                    <MoveIcon width={40} height={40} />
                </button>
                <button 
                    className="item-button"
                    onClick={() => dispatch(hideFeed({name: feed.name}))}>
                    {!feed.isHidden
                        ? <ShowIcon width={40} height={40} />
                        : <HideIcon width={40} height={40} />}
                </button>
            </li>
        )
    }

    return (
        <ul className="feed-list">
            {renderFeedItems(feeds)}
        </ul>
    )
}