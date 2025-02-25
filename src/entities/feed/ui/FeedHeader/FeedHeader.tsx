import { IFeed } from "entities/feed/model/types";
import { FC, useState } from "react";
import { DragDownMenu, Paragraph, Title } from "shared/ui";
import ArrowLeft from "shared/assets/icons/arrow-left-big.svg?react";
import ArrowRight from "shared/assets/icons/arrow-right-big.svg?react";
import More from "shared/assets/icons/more-big.svg?react";
import Hide from "shared/assets/icons/hide-big.svg?react";
import Pin from "shared/assets/icons/pin-big.svg?react";
import { useAppDispatch } from "shared/lib";
import { feedSlice } from "entities/feed/model/feedSlice";
import styles from "./style.module.scss";


interface IFeedHeader {
    name: IFeed["name"];
}

export const FeedHeader: FC<IFeedHeader> = ({ name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { pinFeed, hideFeed } = feedSlice.actions;

    return (
        <header className={styles["feed-header"]}>
            <DragDownMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className={styles["menu-content"]}>
                    <button 
                        className={styles["menu-button"]} 
                        onClick={() => dispatch(pinFeed(name))}
                    >
                        <Pin width={40} height={40} className={styles["button-icon"]} />
                        <Paragraph>Pin to Home</Paragraph>
                    </button>
                    <button 
                        className={styles["menu-button"]} 
                        onClick={() => dispatch(hideFeed(name))}
                    >
                        <Hide width={40} height={40} className={styles["button-icon"]} />
                        <Paragraph>Hide this section</Paragraph>
                    </button>
                </div>
            </DragDownMenu>
            <Title className={styles["feed-name"]}>
                {name}
            </Title>
            <div className={styles["catalogue-actions"]}>
                <button className={styles["catalogue-button"]} disabled>
                    <ArrowLeft width={40} height={40} className={styles["button-icon"]} />
                </button>
                <button className={styles["catalogue-button"]}>
                    <ArrowRight width={40} height={40} className={styles["button-icon"]} />
                </button>
                <button className={styles["catalogue-button"]} onClick={() => setIsOpen(true)}>
                    <More width={40} height={40} className={styles["button-icon"]} />
                </button>
            </div>
        </header>
    )
}