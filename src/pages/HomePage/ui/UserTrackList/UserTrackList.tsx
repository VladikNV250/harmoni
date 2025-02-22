import { FC, useEffect } from "react"
import { Description } from "shared/ui";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { useNavigate } from "react-router";
import { ITrack } from "shared/api/track";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { getUserTopTracks, selectFeedSettings, selectFeedUserTracks } from "entities/feed";
import { Pause, Play } from "shared/assets";
import { usePlaybackAdapter } from "entities/playback";
import "./UserTrackList.scss";

export const UserTrackList: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userTracks = useAppSelector(selectFeedUserTracks);
    const settings = useAppSelector(selectFeedSettings);
    const { adapter } = usePlaybackAdapter();

    useEffect(() => {
        if (settings.updateAfterEveryReload || userTracks.items.length === 0) {
            dispatch(getUserTopTracks({ limit: 6 }))
        }
    }, [dispatch])

    const handlePlay = (context_uri: string, track_uri: string) => {
        adapter.play({
            context_uri,
            offset: {
                uri: track_uri,
            }
        })
    }

    const renderUserTracks = (items: ITrack[]) => {
        return items.map(({album, name, artists, id, uri}) => 
            <div className="usertrack-card" key={id}>
                <div className="card-content" onClick={() => navigate(`/albums/${album.id}`)}>
                    <img src={album.images[0].url || PlaceholderImage} className="card-image" />
                    <div className="card-body">
                        <Description className="card-title">{name}</Description>
                        <Description className="card-artist">{artists.map(artist => artist.name).join(", ")}</Description>
                    </div>
                </div>
                <button className="card-button" onClick={() => handlePlay(album.uri, uri)}>
                    { adapter.getTrackName() === name ?
                      <Pause width={40} height={40} /> :
                      <Play width={40} height={40} />}
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