import {
    FC,
    useEffect
} from "react";
import { getUserQueue } from "features/queue";
import { getAvailableDevices } from "features/device";
import { useTheme } from "entities/theme";
import { usePlaybackAdapter } from "entities/playback";
import { getUserInfo } from "entities/user";
import {
    useAppDispatch,
    useAppSelector,
    useColor,
} from "shared/lib";
import { FullscreenPlayer } from "../FullscreenPlayer/FullscreenPlayer";
import { PlayerCurtain } from "../PlayerCurtain/PlayerCurtain";
import { MinimizedPlayer } from "../MinimizedPlayer/MinimizedPlayer";
import { DesktopPlayer } from "../DesktopPlayer/DesktopPlayer";
import {
    selectPlayerFullsreenMode,
    selectPlayerOpenedMenu
} from "widgets/Player/model/selectors";
import { useLike } from "widgets/Player/lib/player/player";

/**
 * @component Player
 * @description Root player component that combines both mobile and desktop versions.
 * Fetches necessary playback-related data (queue, devices, user info).
 * Render platform-specific components:
 * - `DesktopPlayer` for desktop screens.
 * - `MinimizedPlayer` and `FullscreenPlayer` for mobile screens.
 * - `PlayerCurtain` used for animation FullscreenPlayer.
 */
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