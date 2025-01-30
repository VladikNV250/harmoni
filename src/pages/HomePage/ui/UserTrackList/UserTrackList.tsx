import { FC, useEffect } from "react"
import { Description } from "shared/ui";
import Play from "shared/assets/icons/play-big.svg?react"
// import Pause from "shared/assets/icons/pause-big.svg?react"
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import "./UserTrackList.scss";
import { useNavigate } from "react-router";
import { ITrack } from "shared/api/track";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { getUserTopTracks, selectFeedSettings, selectFeedUserTracks } from "entities/feed";

export const UserTrackList: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userTracks = useAppSelector(selectFeedUserTracks);
    const settings = useAppSelector(selectFeedSettings)

    useEffect(() => {
        if (settings.updateAfterEveryReload || userTracks.items.length === 0) {
            dispatch(getUserTopTracks({ limit: 6 }))
        }
    }, [dispatch])

    const renderUserTracks = (items: ITrack[]) => {
        return items.map(({album, name, artists}, index) => 
            <div className="usertrack-card" key={index}>
            <div className="card-content" onClick={() => navigate(`/search`)}>
                <img src={album.images[0].url || PlaceholderImage} className="card-image" />
                <div className="card-body">
                    <Description className="card-title">{name}</Description>
                    <Description className="card-artist">{artists.map(artist => artist.name).join(", ")}</Description>
                </div>
            </div>
            <button className="card-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
        )
    }

    return (
        (userTracks.items.length > 0 && userTracks.showForUser) &&
        <div className="usertracks-container">
            {renderUserTracks(userTracks.items)}
        </div>
    )
}