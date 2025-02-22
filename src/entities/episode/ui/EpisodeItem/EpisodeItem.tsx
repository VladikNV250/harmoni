import { FC } from "react";
import { useNavigate } from "react-router";
import { IEpisode, ISimplifiedEpisode } from "shared/api/episode";
import { Description, Paragraph } from "shared/ui";
import { getDate } from "entities/episode/lib/getDate";
import { calculateDuration } from "shared/lib";
import { playTrack } from "shared/api/player";
import { 
    AddToQueue, 
    More, 
    PlaceholderImage, 
    Play 
} from "shared/assets";
import "./EpisodeItem.scss";

interface IEpisodeItem {
    readonly episode: IEpisode | ISimplifiedEpisode;
    readonly showURI: string;
}

export const EpisodeItem: FC<IEpisodeItem> = ({ episode, showURI }) => {
    const { 
        id,
        name, 
        description, 
        release_date, 
        release_date_precision, 
        duration_ms, 
        images,
        uri,
    } = episode;
    const navigate = useNavigate();

    const handlePlay = async () => {
        await playTrack({
            context_uri: showURI,
            offset: {
                uri: uri
            }
        })
    }

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
                    <button className="control-panel-button" onClick={handlePlay}>
                        <Play width={40} height={40} />
                    </button>
                </div>
            </div>
        </div>
    )
}