import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { 
    AddToLibrary,
    AddToPlaylist, 
    AddToQueue, 
    CheckFilled, 
    Close, 
    More, 
    Pause, 
    Play, 
    Shuffle 
} from "shared/assets";
import { usePlaybackAdapter } from "entities/playback/lib/usePlaybackAdapter";
import styles from "./style.module.scss";
import { DragDownMenu, Paragraph } from "shared/ui";
import { checkFollowedArtists, checkSavedAlbums, checkSavedShows, followArtists, removeAlbumsFromLibrary, removeShowsFromLibrary, saveAlbumsToLibrary, saveShowsToLibrary, unfollowArtists } from "shared/api/user";
import { checkFollowedPlaylist, followPlaylist, unfollowPlaylist } from "shared/api/playlist";


interface IPagePlaybackControl {
    /** Additional classes */
    readonly className?: string;
    /** Context uri of playing */
    readonly contextUri?: string,
    /** Episode uri if we play episode */
    readonly episodeUri?: string,
}

export const PagePlaybackControl: FC<IPagePlaybackControl> = ({ className, contextUri, episodeUri }) => {
    const [shuffle, setShuffle] = useState(false);
    const { adapter } = usePlaybackAdapter();
    const [isOpen, setIsOpen] = useState(false);
    const [isInLibrary, setIsInLibrary] = useState(false);
    
    useEffect(() => {
        if (adapter.getContextURI() === contextUri) {
            setShuffle(adapter.getShuffle());
        }
    }, [adapter, contextUri]);

    const handlePlay = () => {
        const type = contextUri?.split(":")?.[1] // spotify:episode:1331414 --> episode

        switch (type) {
            case "episode":
                adapter.play({
                    context_uri: contextUri || null,
                    offset: {
                        uri: episodeUri || null
                    }
                })
                break;
            default:
                adapter.play({
                    context_uri: contextUri || null,
                })
        }

        adapter.toggleShuffle(shuffle);
    }

    const toggleShuffle = () => {
        setShuffle(!shuffle);

        if (adapter.getContextURI() === contextUri) {
            adapter.toggleShuffle(!shuffle);
        } 
    }
    
    const addToLibrary = async () => {
        const type = contextUri?.split(":")?.[1]; // spotify:episode:1331414 --> episode
        const id = contextUri?.split(":")?.[2];
        
        if (id) {
            switch (type) {
                case "playlist":
                    await followPlaylist(id);
                    break;
                case "album":
                    await saveAlbumsToLibrary([id]);
                    break;
                case "artist":
                    await followArtists([id]);
                    break;
                case "show":
                    await saveShowsToLibrary([id]);
                    break;
            }
        }
    }

    const removeFromLibrary = async () => {
        const type = contextUri?.split(":")?.[1]; // spotify:episode:1331414 --> episode
        const id = contextUri?.split(":")?.[2];
        
        if (id) {
            switch (type) {
                case "playlist":
                    await unfollowPlaylist(id);
                    break;
                case "album":
                    await removeAlbumsFromLibrary([id]);
                    break;
                case "artist":
                    await unfollowArtists([id]);
                    break;
                case "show":
                    await removeShowsFromLibrary([id]);
                    break;
            }
        }
    }

    const deleteUserPlaylist = async () => {
        const type = contextUri?.split(":")?.[1];
        const id = contextUri?.split(":")?.[2];

        if (id && type === "playlist") {
            unfollowPlaylist(id);
        }
    }

    useEffect(() => {
        const checkItemInLibrary = async () => {
            const type = contextUri?.split(":")?.[1] // spotify:episode:1331414 --> episode
            const id = contextUri?.split(":")?.[2];
            
            if (id) {
                switch (type) {
                    case "playlist":
                        return (await checkFollowedPlaylist(id))[0];
                    case "album":
                        return (await checkSavedAlbums([id]))[0];
                    case "artist":
                        return (await checkFollowedArtists([id]))[0];
                    case "show":
                        return (await checkSavedShows([id]))[0];
                }
            }

            return false;
        }

        (async () => {
            setIsInLibrary(await checkItemInLibrary())
        })()
    }, [contextUri])

    
    return (
        <div className={clsx(styles["control-panel"], className)}>
            <DragDownMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className={styles["menu-content"]}>
                    <button 
                        className={styles["menu-button"]}
                        onClick={async () => await deleteUserPlaylist()}
                    >
                        <Close width={40} height={40} />
                        <Paragraph>Delete Playlist</Paragraph>
                    </button>
                    { 
                        isInLibrary 
                        ?
                        <button 
                            className={styles["menu-button"]}
                            onClick={async () => await removeFromLibrary()}
                        >
                            <CheckFilled width={40} height={40} />
                            <Paragraph>Remove from library</Paragraph>
                        </button>
                        :
                        <button 
                            className={styles["menu-button"]}
                            onClick={async () => await addToLibrary()}
                        >
                            <AddToLibrary width={40} height={40} />
                            <Paragraph>Add to Library</Paragraph>
                        </button>
                    }

                </div>
            </DragDownMenu>
            <div className={styles["control-panel-button-container"]}>
                <button className={styles["control-panel-button"]}>
                    <AddToPlaylist width={40} height={40} />
                </button>
                <button className={styles["control-panel-button"]}>
                    <AddToQueue width={40} height={40} />
                </button>
                <button 
                    className={styles["control-panel-button"]}
                    onClick={() => setIsOpen(true)}
                >
                    <More width={40} height={40} />
                </button>
            </div>
            <div className={styles["control-panel-button-container"]}>
                <button 
                    className={styles["control-panel-button"]} 
                    onClick={toggleShuffle}
                >
                    <Shuffle width={40} height={40} />
                </button>
                <button 
                    className={styles["control-panel-button"]} 
                    onClick={handlePlay}
                >
                    {adapter.getContextURI() === contextUri ?
                    <Pause width={40} height={40} /> :
                    <Play width={40} height={40} />}
                </button>
            </div>
        </div>
    )
}