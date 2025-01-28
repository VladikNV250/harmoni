import { FC } from "react";
import PinIcon from "shared/assets/icons/pin-big.svg?react";
import MoveIcon from "shared/assets/icons/move-big.svg?react";
import ShowIcon from "shared/assets/icons/show-big.svg?react";
// import HideIcon from "shared/assets/icons/show-big__filled.svg?react";
import { Description } from "shared/ui";
import clsx from "clsx";
import "./FeedList.scss";
import { useAppSelector } from "shared/lib";
import { selectFeeds } from "entities/feed/model/selectors";
import { IFeed } from "entities/feed/model/types";

export const FeedList: FC = () => {
    const feeds = useAppSelector(selectFeeds);

    const renderFeedItems = (feeds: {
        [key: string]: IFeed
    }) => {
        return Object.keys(feeds).map((feedName, index) => 
            <li 
                key={index} 
                className={clsx("item-feed")}>
                <button 
                    className="item-button" 
                    // onClick={() => dispatch(pinFeed({name: feed.name}))}
                    >
                    <PinIcon
                        width={40} height={40}
                        className={clsx("icon")}
                    />
                </button>
                <Description className="item-name">
                    {feedName}
                </Description>
                <button className="item-button grab-button">
                    <MoveIcon width={40} height={40} />
                </button>
                <button 
                    className="item-button"
                    // onClick={() => dispatch(hideFeed({name: feed.name}))}
                    >
                    {/* {!feed.isHidden */}
                         <ShowIcon width={40} height={40} />
                        {/* : <HideIcon width={40} height={40} />} */}
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