import { Description, DragDownMenu, Paragraph, Switch } from "shared/ui"
import AddIcon from "shared/assets/icons/add-sample-big.svg?react"
import { useTheme } from "entities/theme";
import { FC, useEffect, useState } from "react";
import { FeedList, feedSlice } from "entities/feed";
import { useAppDispatch } from "shared/lib";
import "./AdjustContextMenu.scss";

interface IAdjustContextMenu {
    readonly isOpen?: boolean;
    readonly setIsOpen?: (isOpen: boolean) => void;
}

export const AdjustContextMenu: FC<IAdjustContextMenu> = ({ isOpen = false, setIsOpen }) => {
    const { theme } = useTheme();
    const [active, setActive] = useState(true);
    const dispatch = useAppDispatch();
    const { hideRecommendedFeeds } = feedSlice.actions;

    useEffect(() => {
        dispatch(hideRecommendedFeeds(!active))
    }, [active, dispatch, hideRecommendedFeeds])

    return (
        <DragDownMenu isOpen={isOpen} setIsOpen={setIsOpen} className={theme}>
            <div className="menu-content" onClick={(e) => e.stopPropagation()}>
                <Paragraph className="menu-title">Customize Feed</Paragraph>
                <div className="horizontal-line" />
                <div className="scroll-container">
                    <button 
                        className="button-select_from_library" 
                        >
                        <AddIcon width={40} height={40} className="button-icon" />
                        Select from Library
                    </button>
                    <FeedList />
                    <div className="allow-recommendation-rows-container">
                        <Description className="allow-recommendation-rows-text">
                            Allow Recommendation Rows
                        </Description>
                        <Switch 
                            active={active}
                            setActive={setActive} 
                        />
                    </div>
                </div>
                
            </div>
        </DragDownMenu>
    )
}