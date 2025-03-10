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

export const Player: FC = () => {    
    const { theme } = useTheme();
    const { activeTab, chooseTab } = useTabs<"devices" | "queue", "track">("track");    
    const dispatch = useAppDispatch();
    const fullscreen = useAppSelector(selectPlayerFullsreenMode);
    const { adapter } = usePlaybackAdapter();
    const color = useColor(adapter.getTrackImage(), true, theme ?? "none");

    useEffect(() => {
        dispatch(getUserQueue());
        dispatch(getAvailableDevices());
    }, [dispatch])

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
    }, [activeTab, dispatch, fullscreen])

    if (adapter) return (
        <>
            <PlayerCurtain />
            <FullscreenPlayer 
                color={color}
                activeTab={activeTab}
                chooseTab={chooseTab}
            />
            <MinimizedPlayer 
                color={color}
                chooseTab={chooseTab}
            />
        </>
    )
}