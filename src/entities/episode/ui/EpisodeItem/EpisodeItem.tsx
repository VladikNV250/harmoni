import { FC } from "react";
import { useNavigate } from "react-router";
import { IEpisode, ISimplifiedEpisode } from "shared/api/episode";
import { Description, Paragraph } from "shared/ui";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { getDate } from "entities/episode/lib/getDate";
import { calculateDuration } from "shared/lib";
import More from "shared/assets/icons/more-big.svg?react";
import Play from "shared/assets/icons/play-big.svg?react";
import AddToQueue from "shared/assets/icons/add-to-queue-big.svg?react";
import Shuffle from "shared/assets/icons/shuffle-big.svg?react";
import Loop from "shared/assets/icons/loop-big.svg?react";
import "./EpisodeItem.scss";

interface IEpisodeItem {
    readonly episode: IEpisode | ISimplifiedEpisode;
}

export const EpisodeItem: FC<IEpisodeItem> = ({ episode }) => {
    const { 
        id,
        name, 
        description, 
        release_date, 
        release_date_precision, 
        duration_ms, 
        images 
    } = episode;
    const navigate = useNavigate();

    return (
        <div className="episode-item item">
            <div className="item-image-container" onClick={() => navigate(`/episodes/${id}`)}>
                <img 
                    src={images[0]?.url || PlaceholderImage} 
                    className="item-image"    
                />
                <div className="item-body">
                    <Paragraph className="item-name">
                        {name ?? ""}
                    </Paragraph>
                    <Description className="item-author">
                        {description ?? ""}
                    </Description>
                </div>
            </div>
            <div className="item-content">
                <Description className="item-date">
                    {getDate(release_date, release_date_precision)}
                </Description>
                <p className="dot">&#183;</p>
                <Description className="item-duration">
                    {calculateDuration(duration_ms)}
                </Description>
            </div>
            <div className="item-control-panel control-panel">
                <div className="control-panel-button-container">
                    <button className="control-panel-button">
                        <AddToQueue width={40} height={40} />
                    </button>
                    <button className="control-panel-button">
                        <More width={40} height={40} />
                    </button>
                </div>
                <div className="control-panel-button-container">
                    <button className="control-panel-button">
                        <Loop width={40} height={40} />
                    </button>
                    <button className="control-panel-button">
                        <Shuffle width={40} height={40} />
                    </button>
                    <button className="control-panel-button">
                        <Play width={40} height={40} />
                    </button>
                </div>
            </div>
        </div>
    )
}