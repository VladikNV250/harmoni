import { FC } from "react";
import { useAppSelector } from "shared/lib";
import "./PlayerCurtain.scss";
import { selectPlayerFullsreenMode } from "widgets/Player/model/selectors";

export const PlayerCurtain: FC = () => {
    const fullscreen = useAppSelector(selectPlayerFullsreenMode);

    if (fullscreen) return (
        <div className="player-curtain" />
    )
}