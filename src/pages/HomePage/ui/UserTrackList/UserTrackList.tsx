import {
    FC,
    useEffect
} from "react"
import { useNavigate } from "react-router";
import {
    getUserTopTracks,
    selectFeedSettings,
    selectFeedUserTracks
} from "entities/feed";
import { usePlaybackAdapter } from "entities/playback";
import { Description } from "shared/ui";
import { ITrack } from "shared/api/track";
import {
    useAppDispatch,
    useAppSelector
} from "shared/lib";
import {
    Pause,
    PlaceholderImage,
    Play
} from "shared/assets";
import { toast } from "react-toastify";
import styles from "./style.module.scss";

/**
 * @component UserTrackList
 * @description Component responsible for rendering user top tracks.
 * Clicking on the play/pause button of track you can play/resume track playback.
 * Clicking on the track item itself you can go to the album track page. 
 */
export const UserTrackList: FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userTracks = useAppSelector(selectFeedUserTracks);
    const settings = useAppSelector(selectFeedSettings);
    const { adapter } = usePlaybackAdapter();

    useEffect(() => {
        if (settings.updateAfterEveryReload || userTracks.items.length === 0) {
            dispatch(getUserTopTracks({ limit: 8 }))
        }
    }, [dispatch])

    const handlePlay = async (context_uri: string, track_uri: string) => {
        try {
            await adapter.play({
                context_uri,
                offset: {
                    uri: track_uri,
                }
            })
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const renderUserTracks = (items: ITrack[]) => {
        return items.length > 0 && items.map(({ album, name, artists, id, uri }) =>
            <div className={styles["usertrack-card"]} key={id}>
                <div
                    className={styles["card-content"]}
                    onClick={() => navigate(`/albums/${album.id}`)}
                >
                    <img
                        src={album.images[0].url || PlaceholderImage}
                        className={styles["card-image"]}
                    />
                    <div className={styles["card-body"]}>
                        <Description className={styles["card-title"]}>
                            {name}
                        </Description>
                        <Description className={styles["card-artist"]}>
                            {artists.map(artist => artist.name).join(", ")}
                        </Description>
                    </div>
                </div>
                <button
                    className={styles["card-button"]}
                    onClick={async () => await handlePlay(album.uri, uri)}
                >
                    {adapter.getTrackName() === name ?
                        <Pause width={40} height={40} /> :
                        <Play width={40} height={40} />}
                </button>
            </div>
        )
    }

    return (
        ((userTracks?.items?.length ?? 0) > 0 && (userTracks?.showForUser ?? false)) &&
        <div className={styles["usertracks-container"]}>
            {renderUserTracks(userTracks?.items ?? [])}
        </div>
    )
}