import { 
    FC, 
    useMemo, 
} from "react";
import { 
    followPlaylist, 
    IPlaylist, 
    unfollowPlaylist 
} from "shared/api/playlist";
import { 
    AddIcon, 
    CheckFilled, 
    More, 
    Pause, 
    Play, 
    Shuffle 
} from "shared/assets";
import { 
    useAppDispatch, 
    useAppSelector, 
    useControlPanel 
} from "shared/lib";
import { 
    getLibraryPlaylists, 
    selectSavedPlaylists 
} from "features/library";
import { selectUser } from "entities/user";
import { usePlaybackAdapter } from "entities/playback";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";
import { MoreMenu } from "../MoreMenu/MoreMenu";

interface IPlaylistControlPanel {
    readonly playlist: IPlaylist | null,
}

export const PlaylistControlPanel: FC<IPlaylistControlPanel> = ({ playlist }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const { adapter } = usePlaybackAdapter();
    const { controlPanel, updateControlPanel } = useControlPanel({
        shuffle: false,
        moreMenu: false,
    } as Record<string, boolean>);
    
    const setShuffle = (state: boolean) => updateControlPanel('shuffle', state);
    const setMoreMenu = (state: boolean) => updateControlPanel('moreMenu', state);
    

    const isPlaylistInLibrary = useMemo(
        () => libraryPlaylists.findIndex(item => item.id === playlist?.id) !== -1,
        [libraryPlaylists, playlist]
    )

    const isUserOwner = useMemo(
        () => playlist?.owner.id === user?.id,
        [user, playlist]
    )

    const handlePlay = async () => {
        try {
            if (adapter.getContextURI() === playlist?.uri) {
                await adapter.resume();
            } else {
                await adapter.play({ context_uri: playlist?.uri ?? "" });
                adapter.toggleShuffle(controlPanel.shuffle);
            }
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const toggleShuffle = () => {
        setShuffle(!controlPanel.shuffle);

        if (adapter.getContextURI() === playlist?.uri) {
            adapter.toggleShuffle(!controlPanel.shuffle);
        }
    }

    const savePlaylist = async () => {
        try {
            if (isPlaylistInLibrary) {
                await unfollowPlaylist(playlist?.id ?? "");
                toast.info("The playlist has been removed from the library.");
            } else {
                await followPlaylist(playlist?.id ?? "");
                toast.info("The playlist has been added to the library.");
            }
            dispatch(getLibraryPlaylists());
        } catch (e) {
            toast.error("Something went wrong. Try to reload the page.")
            console.error("SAVE", e);
        }
    }

    return (
        <div className={styles["playlist-control-panel"]}>
            <div className={styles["control-panel-button-container"]}>
                <button 
                    className={styles["control-panel-button"]} 
                    onClick={async () => await handlePlay()}
                    >
                    {adapter.getContextURI() === playlist?.uri && adapter.getIsPlaying() ?
                    <Pause width={60} height={60} /> :
                    <Play width={60} height={60} />}
                </button>
                <button 
                    className={clsx(
                        styles["control-panel-button"],
                        controlPanel.shuffle && styles["shuffle"],
                    )} 
                    onClick={toggleShuffle}
                >
                    <Shuffle width={50} height={50} />
                </button>
                {!isUserOwner 
                &&
                <button
                    className={clsx(
                        styles["control-panel-button"],
                        isPlaylistInLibrary && styles["active"]
                    )}
                    onClick={async () => await savePlaylist()}
                >
                    <AddIcon width={50} height={50} className={styles["icon"]} />
                    <CheckFilled width={50} height={50} className={styles["icon__active"]} />
                </button>}
                <button
                    className={styles["control-panel-button"]}
                    onClick={() => setMoreMenu(!controlPanel.moreMenu)}
                >
                    <MoreMenu 
                        isOpen={controlPanel.moreMenu} 
                        setIsOpen={setMoreMenu} 
                        playlist={playlist} 
                    />
                    <More width={50} height={50} />
                </button>
            </div>
        </div>
    )
}