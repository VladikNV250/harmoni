import { FC, useEffect } from "react";
import { 
    useAppDispatch, 
    useAppSelector, 
    useColor, 
    useTabs
} from "shared/lib";
import { useTheme } from "entities/theme";
import { FullscreenPlayer } from "../FullscreenPlayer/FullscreenPlayer";
import { PlayerCurtain } from "../PlayerCurtain/PlayerCurtain";
import { getUserQueue } from "features/queue";
import { getAvailableDevices } from "features/device";
import { MinimizedPlayer } from "../MinimizedPlayer/MinimizedPlayer";
import { usePlaybackAdapter } from "entities/playback";
import { selectPlayerFullsreenMode } from "widgets/Player/model/selectors";
import { getUserInfo } from "entities/user";
import { useIsLikedTrack } from "widgets/Player/lib/track/useIsLikedTrack";

export const Player: FC = () => {    
    const { theme } = useTheme();
    const { activeTab, chooseTab } = useTabs<"devices" | "queue", "track">("track"); 
    const dispatch = useAppDispatch();
    const fullscreen = useAppSelector(selectPlayerFullsreenMode);
    const { adapter } = usePlaybackAdapter();
    const color = useColor(adapter.getTrackImage(), true, theme ?? "none");
    const { isLiked, setIsLiked } = useIsLikedTrack(adapter); 

    useEffect(() => {
        dispatch(getUserQueue());
        dispatch(getAvailableDevices());
        dispatch(getUserInfo());
    }, [dispatch]);

    useEffect(() => {
        switch (activeTab) {
            case "devices": 
                dispatch(getAvailableDevices());
                break;
            case "queue": 
                dispatch(getUserQueue());
                break;
            case "track": 
                // dispatch(getPlaybackState());
                break;
        }
    }, [activeTab, dispatch, fullscreen]);


    return (
        <>
            <PlayerCurtain />
            <FullscreenPlayer 
                color={color}
                activeTab={activeTab}
                chooseTab={chooseTab}
                isLiked={isLiked}
                setIsLiked={setIsLiked}
            />
            <MinimizedPlayer 
                color={color}
                chooseTab={chooseTab}
                isLiked={isLiked}
                setIsLiked={setIsLiked}
            />
        </>
    )
}