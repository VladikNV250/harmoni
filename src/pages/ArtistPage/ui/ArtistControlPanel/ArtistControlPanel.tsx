import { 
    FC, 
    useEffect, 
    useMemo, 
    useState 
} from "react";
import { 
    Pause, 
    Play, 
    Shuffle 
} from "shared/assets";
import { 
    Description, 
    OutlinedButton 
} from "shared/ui";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    getLibraryArtists, 
    selectFollowedArtists 
} from "features/library";
import { 
    followArtists, 
    unfollowArtists 
} from "shared/api/user";
import { IArtist } from "shared/api/artist";
import { usePlaybackAdapter } from "entities/playback";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IArtistControlPanel {
    readonly artist: IArtist | null;
    readonly className?: string;
}

export const ArtistControlPanel: FC<IArtistControlPanel> = ({ artist, className }) => {
    const dispatch = useAppDispatch();
    const [shuffle, setShuffle] = useState<boolean>(false);
    const libraryArtists = useAppSelector(selectFollowedArtists);
    const { adapter } = usePlaybackAdapter();

    useEffect(() => {
        if (adapter.getContextURI() === artist?.uri) {
            setShuffle(adapter.getShuffle());
        }
    }, [adapter.getContextURI(), artist])

    const isArtistFollowed = useMemo(
        () => libraryArtists.findIndex(item => item.id === artist?.id) !== -1 ? true : false,
        [libraryArtists, artist] 
    )

    const handlePlay = async () => {
        try {
            if (adapter.getContextURI() === artist?.uri) {
                await adapter.resume();
            } else {
                await adapter.play({ context_uri: artist?.uri ?? "" });
                adapter.toggleShuffle(shuffle);
            }
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const toggleShuffle = () => {
        setShuffle(!shuffle);

        if (adapter.getContextURI() === artist?.uri) {
            adapter.toggleShuffle(!shuffle);
        }
    }

    const handleFollow = async () => {
        try {
            if (isArtistFollowed) {
                await unfollowArtists([artist?.id ?? ""]);
            } else {
                await followArtists([artist?.id ?? ""]);
            }
            dispatch(getLibraryArtists());
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.");
            console.error("FOLLOW", e);
        }
    }

    return (
        <div className={clsx(
            styles["artist-control-panel"],
            className
        )}>
            <div className={styles["control-panel-button-container"]}>
                <button 
                    className={styles["control-panel-button"]} 
                    onClick={async () => await handlePlay()}
                    >
                    {adapter.getContextURI() === artist?.uri && adapter.getIsPlaying() ?
                    <Pause width={60} height={60} /> :
                    <Play width={60} height={60} />}
                </button>
                <button 
                    className={clsx(
                        styles["control-panel-button"],
                        shuffle && styles["shuffle"],
                    )} 
                    onClick={toggleShuffle}
                >
                    <Shuffle width={50} height={50} />
                </button>
            </div>
            <OutlinedButton 
                className={styles["control-panel-button"]}
                onClick={async () => await handleFollow()}>
                <Description>
                    {isArtistFollowed
                    ? "Unfollow"
                    : "Follow"}
                </Description>
            </OutlinedButton>
        </div>
    )
}