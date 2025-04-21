import {
    FC,
    MutableRefObject,
    useState
} from "react";
import {
    BottomSheet,
    ContextMenu,
    MenuButton,
    Title
} from "shared/ui";
import {
    ArrowLeft,
    ArrowRight,
    Hide,
    More,
    PinIcon
} from "shared/assets";
import {
    useAppDispatch,
    useWindowDimensions
} from "shared/lib";
import { IFeed } from "entities/feed/model/types";
import { feedSlice } from "entities/feed/model/feedSlice";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IFeedHeader {
    /** Object of feed, which will be rendered */
    readonly feed: IFeed;
    /** Ref to carousel. Need for slide functions. */
    readonly carouselRef: MutableRefObject<null | HTMLDivElement>;
}

/**
 * @component FeedHeader
 * @description Header with control actions for feed (CatalogueItem).
 * - Display name of feed.
 * - Clicking on the arrow buttons can slide right or left feed.
 * - Clicking on the three dots open menu, which you can hide feed or pin in the top of home page.
 */
export const FeedHeader: FC<IFeedHeader> = ({ feed, carouselRef }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { pinFeed, hideFeed } = feedSlice.actions;
    const { width } = useWindowDimensions();

    const slideNext = () => {
        if (carouselRef?.current) {
            carouselRef?.current.scrollBy({
                left: 180,
            });
        }
    }

    const slidePrev = () => {
        if (carouselRef?.current) {
            carouselRef?.current.scrollBy({
                left: -180,
            });
        }
    }

    return (
        <header className={styles["feed-header"]}>
            {width < 768 &&
                <BottomSheet
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                >
                    <MenuButton
                        Icon={PinIcon}
                        text={feed.order < 0 ?
                            "Unpin from Home" :
                            "Pin to Home"}
                        hasNestedMenu={false}
                        onClick={() => dispatch(pinFeed(feed.name))}
                        isActive={feed.order < 0}
                    />
                    <MenuButton
                        Icon={Hide}
                        text={"Hide this section"}
                        hasNestedMenu={false}
                        onClick={() => dispatch(hideFeed(feed.name))}
                    />
                </BottomSheet>}
            <Title className={styles["feed-name"]}>
                {feed.name}
            </Title>
            <div className={styles["catalogue-actions"]}>
                <button
                    className={clsx(
                        styles["catalogue-button"],
                        styles["catalogue-button-carousel"]
                    )}
                    onClick={slidePrev}
                >
                    <ArrowLeft width={40} height={40} />
                </button>
                <button
                    className={clsx(
                        styles["catalogue-button"],
                        styles["catalogue-button-carousel"]
                    )}
                    onClick={slideNext}
                >
                    <ArrowRight width={40} height={40} />
                </button>
                <button
                    className={styles["catalogue-button"]}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {width >= 768 &&
                        <ContextMenu
                            className={styles["context-menu"]}
                            isMenuOpen={isOpen}
                            setIsMenuOpen={setIsOpen}
                        >
                            <MenuButton
                                Icon={PinIcon}
                                text={feed.order < 0 ?
                                    "Unpin from Home" :
                                    "Pin to Home"}
                                hasNestedMenu={false}
                                onClick={() => {
                                    setIsOpen(false);
                                    dispatch(pinFeed(feed.name));
                                }}
                                isActive={feed.order < 0}
                            />
                            <MenuButton
                                Icon={Hide}
                                text={"Hide this section"}
                                hasNestedMenu={false}
                                onClick={() => {
                                    setIsOpen(false);
                                    dispatch(hideFeed(feed.name))
                                }}
                            />
                        </ContextMenu>
                    }
                    <More width={40} height={40} />
                </button>
            </div>
        </header>
    )
}