import {
    FC,
    Fragment
} from "react"
import { selectUser } from "entities/user";
import {
    BottomSheet,
    ContextMenu,
    Description,
    FilledButton,
    MenuButton,
    Paragraph
} from "shared/ui"
import {
    useAppSelector,
    useWindowDimensions
} from "shared/lib";
import { selectSavedPlaylists } from "features/library";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import {
    AddSimple,
    AddToPlaylist,
    PlaceholderImage,
    PlaylistIcon
} from "shared/assets";
import styles from "./style.module.scss";
import clsx from "clsx";


interface IPlaylistMenu {
    /** Controls whether the menu is visible. */
    readonly isOpen: boolean;
    /** Callback to toggle the menu's visibility. */
    readonly setIsOpen: (state: boolean) => void;
    /** Called when the user chooses to create a new folder. */
    readonly onCreatePlaylist: () => Promise<void> | void;
    /** Called when the user selects a playlist from list. */
    readonly onSelectPlaylist: (playlistId: string) => Promise<void> | void;
    /** Id of playlist. Used on a playlist page to hide the page's playlist from the list. */
    readonly playlistId?: string; 
    /** Check is menu is nested in other menu */
    readonly isNested?: boolean;
    /** Additional styles */
    readonly className?: string;
}

/**
 * @component PlaylistMenu
 * @description Renders a responsive menu with a list of playlists and button to add to new playlist. Can be nested in other menu.
 * - On desktop (>=768): shows a dropdown context menu.
 * - On mobile: shows a bottom sheet.
 * 
 * Typically used for adding some items (like tracks or episodes) to playlists.
 */
export const PlaylistMenu: FC<IPlaylistMenu> = (props) => {
    const {
        isOpen,
        setIsOpen,
        onCreatePlaylist,
        onSelectPlaylist,
        playlistId,
        isNested = false,
        className,
    } = props;
    const user = useAppSelector(selectUser);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const { width } = useWindowDimensions();

    const renderPlaylists = (items: ISimplifiedPlaylist[]) => {
        const userPlaylists = items.filter(item => item.owner?.id === user?.id && item.id !== playlistId);

        return userPlaylists.map((playlist) => {

            const content = width >= 768 ? (
                <MenuButton
                    Icon={PlaylistIcon}
                    text={playlist.name ?? ""}
                    onClick={async () => await onSelectPlaylist(playlist.id)}
                />
            ) : (
                <button
                    className={styles["playlist-menu-button"]}
                    onClick={async () => await onSelectPlaylist(playlist.id)}
                >
                    <img
                        src={playlist.images?.[0]?.url || PlaceholderImage}
                        className={styles["button-image"]}
                    />
                    <Description>
                        {playlist.name ?? ""}
                    </Description>
                    <AddToPlaylist width={40} height={40} />
                </button>
            )

            return <Fragment key={playlist.id}>{content}</Fragment>
        })
    }

    return (
        width >= 768
            ?
            <ContextMenu
                className={clsx(
                    styles["playlist-menu"],
                    className
                )}
                isMenuOpen={isOpen}
                setIsMenuOpen={setIsOpen}
                isNested={isNested}
                additionalElements={
                    <MenuButton
                        Icon={AddSimple}
                        text="Add to new playlist"
                        onClick={async () => await onCreatePlaylist()}
                    />
                }
            >
                {renderPlaylists(libraryPlaylists)}
            </ContextMenu>
            :
            <BottomSheet
                className={clsx(
                    styles["playlist-menu"],
                    className
                )}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <FilledButton onClick={async () => await onCreatePlaylist()}>
                    <Paragraph>
                        New Playlist
                    </Paragraph>
                </FilledButton>
                <div className={styles["playlist-menu-list"]}>
                    {renderPlaylists(libraryPlaylists)}
                </div>
            </BottomSheet>
    )
}