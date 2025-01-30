import { FC } from "react";
import { Description, DragDownMenu, Paragraph, Switch } from "shared/ui"
import AddIcon from "shared/assets/icons/add-sample-big.svg?react"
import { useTheme } from "entities/theme";
import { FeedList, feedSlice, selectFeedUserTracks } from "entities/feed";
import { useAppDispatch, useAppSelector } from "shared/lib";
import "./AdjustContextMenu.scss";

interface IAdjustContextMenu {
    readonly isOpen?: boolean;
    readonly setIsOpen?: (isOpen: boolean) => void;
}

export const AdjustContextMenu: FC<IAdjustContextMenu> = ({ isOpen = false, setIsOpen }) => {
    const { theme } = useTheme();
    const userTracks = useAppSelector(selectFeedUserTracks);
    const dispatch = useAppDispatch();
    const { setShowForUser } = feedSlice.actions;

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
                    <div className="allow-usertracks-container">
                        <Description className="allow-usertracks-text">
                            Allow Displaying User Tracks
                        </Description>
                        <Switch 
                            active={userTracks.showForUser}
                            setActive={(active: boolean) => dispatch(setShowForUser(active))} 
                            disabled={userTracks.items.length === 0}
                        />
                    </div>
                </div>
                
            </div>
        </DragDownMenu>
    )
}