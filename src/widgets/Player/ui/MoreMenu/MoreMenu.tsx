import { FC } from "react";
import { PlaylistMenu } from "features/menus";
import { ArtistMenu } from "entities/artist";
import { selectUser } from "entities/user";
import { usePlaybackAdapter } from "entities/playback";
import { 
    AddToPlaylist, 
    AddToQueue, 
    Album, 
    ArtistIcon,
    Device,
    Like,
    LikeFilled,
    Queue, 
} from "shared/assets";
import { 
    useAppDispatch,
    useAppSelector,
    useWindowDimensions, 
} from "shared/lib";
import { 
    BottomSheet,
    ContextMenu,
    MenuButton,
} from "shared/ui";
import { usePlaylistActions, useQueue } from "widgets/Player/lib/player/player";
import { playerSlice } from "widgets/Player/model/playerSlice";
import { selectPlayerOpenedMenu } from "widgets/Player/model/selectors";
import styles from "./style.module.scss";


interface IMoreMenu {
    /** Controls whether track is saved in the library. */
    readonly isLiked?: boolean,
    /** Callback to save or remove track from the library. */
    readonly handleLike?: () => Promise<void>;
}

/**
 * @component MoreMenu
 * @description Provides additional playback-related actions in a contextual menu. 
 * 
 * Users can add the track to a playlist or queue, like/unlike it, open album or artist pages, or view available devices.
 * Renders as a ContextMenu on desktop and a BottomSheet on mobile.
 */
export const MoreMenu: FC<IMoreMenu> = ({ isLiked, handleLike }) => {
    const dispatch = useAppDispatch();    
    const openedMenu = useAppSelector(selectPlayerOpenedMenu);
    const { adapter } = usePlaybackAdapter();
    const { toggleFullscreenMode, setOpenedMenu } = playerSlice.actions;
    const { width } = useWindowDimensions();
    const user = useAppSelector(selectUser);
    
    const addItemToQueueHandle = useQueue();

    const { addToPlaylist, addToNewPlaylist } = usePlaylistActions({
        onAddToNewPlaylist: () => {
            dispatch(setOpenedMenu("none"));
            dispatch(toggleFullscreenMode());
        },
        onAddToPlaylist: () => {
            dispatch(setOpenedMenu("none"));
        }
    })

    return (
        width >= 768 
        ?
        <ContextMenu
            className={styles["context-menu"]}
            isMenuOpen={openedMenu === "more" || openedMenu === "artist" || openedMenu === "playlist"}
            setIsMenuOpen={() => dispatch(setOpenedMenu("none"))}
            hideMainContent={openedMenu === "playlist" || openedMenu === "artist"}
            hasNested
            additionalElements={[
                <PlaylistMenu 
                    key={"more-playlist"}
                    isOpen={openedMenu === "playlist"}
                    setIsOpen={() => dispatch(setOpenedMenu("more"))}
                    onSelectPlaylist={addToPlaylist}
                    onCreatePlaylist={addToNewPlaylist}
                    isNested
                />,
                <ArtistMenu 
                    key={"more-artist"}
                    isOpen={openedMenu === "artist"}
                    setIsOpen={() => dispatch(setOpenedMenu("more"))}
                    artists={adapter.getArtists()}
                />
            ]}
        >
            <MenuButton 
                Icon={AddToPlaylist}
                text="Add to playlist"
                onClick={() => dispatch(setOpenedMenu("playlist"))}
                hasNestedMenu
                disabled={user?.product !== "premium" || !adapter.checkPlayback()}
            />
            <MenuButton 
                Icon={AddToQueue}
                text="Add to queue"
                onClick={async () => await addItemToQueueHandle(adapter.getTrackURI())}
                disabled={user?.product !== "premium" || !adapter.checkPlayback()}
            />
            <MenuButton 
                Icon={Album}
                text="Go to album"
                buttonType="link-button"
                to={adapter.getAlbumLink()}
                onClick={() => dispatch(setOpenedMenu("none"))}
                disabled={user?.product !== "premium" || !adapter.checkPlayback()}
            />
            {adapter.getArtists().length > 1 
            ?
                <MenuButton 
                    Icon={ArtistIcon}
                    text="Go to artist"
                    onClick={() => dispatch(setOpenedMenu("artist"))}
                    hasNestedMenu
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                />
            :
                <MenuButton 
                    Icon={ArtistIcon}
                    text="Go to artist"
                    buttonType='link-button'
                    to={`/artists/${adapter.getArtists()?.[0]?.id}`}                            
                    onClick={() => dispatch(setOpenedMenu("none"))}
                    disabled={user?.product !== "premium" || !adapter.checkPlayback()}
                />
            }
            <MenuButton 
                className={styles["button-overflow"]}
                Icon={isLiked ?
                    LikeFilled :
                    Like
                }
                text={isLiked ?
                    "Remove from library" :
                    "Save to library"
                }
                onClick={async () => await handleLike?.()}
                disabled={user?.product !== "premium" || !adapter.checkPlayback()}
            />
            <MenuButton 
                className={styles["button-overflow"]}
                Icon={Device}
                text="View available devices"
                onClick={() => dispatch(setOpenedMenu("device"))}
            />
            <MenuButton 
                className={styles["button-overflow"]}
                Icon={Queue}
                text="Open queue"
                onClick={() => dispatch(setOpenedMenu("queue"))}
                disabled={user?.product !== "premium" || !adapter.checkPlayback()}
            />
        </ContextMenu>
        :
        <BottomSheet
            isOpen={openedMenu === "more" || openedMenu === "playlist" || openedMenu === "artist"}
            setIsOpen={() => dispatch(setOpenedMenu("none"))}
        >
            <ArtistMenu
                className={styles["artist-menu"]}
                artists={adapter.getArtists()}
                isOpen={openedMenu === "artist"}
                setIsOpen={() => dispatch(setOpenedMenu("none"))}
                />
            <PlaylistMenu 
                className={styles["playlist-menu"]}
                isOpen={openedMenu === "playlist"}
                setIsOpen={() => dispatch(setOpenedMenu("none"))}
                onCreatePlaylist={addToNewPlaylist}
                onSelectPlaylist={addToPlaylist}
            />
            <MenuButton
                Icon={AddToPlaylist}
                text="Add to playlist"
                onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setOpenedMenu("playlist"))
                }}
                hasNestedMenu
            />
            <MenuButton
                Icon={AddToQueue}
                text="Add to queue"
                onClick={async () => await addItemToQueueHandle(adapter.getTrackURI())}
            />
            <MenuButton
                Icon={Album}
                text="Go to album"
                onClick={() => dispatch(toggleFullscreenMode())}
                buttonType="link-button"
                to={adapter.getAlbumLink()}
            />
            {adapter.getArtists().length > 1 
            ?
                <MenuButton
                    Icon={ArtistIcon}
                    text="Go to artist"
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setOpenedMenu("artist"));
                    }}
                />
            :
                <MenuButton
                    Icon={ArtistIcon}
                    text="Go to artist"
                    onClick={() => dispatch(toggleFullscreenMode())}
                    buttonType="link-button"
                    to={`/artists/${adapter.getArtists()?.[0]?.id}`}
                    hasNestedMenu
                />
            }
        </BottomSheet>
    )
}