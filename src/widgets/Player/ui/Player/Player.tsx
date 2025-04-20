import { FC, useEffect } from "react";
import { 
    useAppDispatch, 
    useAppSelector, 
    useColor, 
} from "shared/lib";
import { useTheme } from "entities/theme";
import { FullscreenPlayer } from "../FullscreenPlayer/FullscreenPlayer";
import { PlayerCurtain } from "../PlayerCurtain/PlayerCurtain";
import { getUserQueue } from "features/queue";
import { getAvailableDevices } from "features/device";
import { MinimizedPlayer } from "../MinimizedPlayer/MinimizedPlayer";
import { usePlaybackAdapter } from "entities/playback";
import { selectPlayerFullsreenMode, selectPlayerOpenedMenu } from "widgets/Player/model/selectors";
import { getUserInfo } from "entities/user";
import { useLike } from "widgets/Player/lib/player/player";
import { DesktopPlayer } from "../DesktopPlayer/DesktopPlayer";


export const Player: FC = () => {    
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const fullscreen = useAppSelector(selectPlayerFullsreenMode);
    const { adapter } = usePlaybackAdapter();
    const color = useColor(adapter.getTrackImage(), true, theme ?? "none");
    const { isLiked, handleLike } = useLike(); 

    useEffect(() => {
        dispatch(getUserQueue());
        dispatch(getAvailableDevices());
        dispatch(getUserInfo());
    }, [dispatch]);

    useEffect(() => {
        switch (openedMenu) {
            case "device": 
                dispatch(getAvailableDevices());
                break;
            case "queue": 
                dispatch(getUserQueue());
                break;
            case "track": 
                break;
        }
    }, [openedMenu, dispatch, fullscreen]);


    return (
        <>
            <DesktopPlayer
                color={color}
                isLiked={isLiked}
                handleLike={handleLike}
            />
            <PlayerCurtain />
            <FullscreenPlayer 
                color={color}
                isLiked={isLiked}
                handleLike={handleLike}
            />
            <MinimizedPlayer 
                color={color}
                isLiked={isLiked}
                handleLike={handleLike}
            />
        </>
    )
}