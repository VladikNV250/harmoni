import { FC } from "react"
import { Description, DragDownMenu, FilledButton, Paragraph } from "shared/ui"
import { useAppSelector } from "shared/lib";
import { selectUser } from "entities/user";
import { selectSavedPlaylists } from "features/library";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import { AddToPlaylist, PlaceholderImage } from "shared/assets";
import styles from "./style.module.scss";


interface IPlaylistMenu {
    readonly isOpen: boolean;
    readonly setIsOpen: (state: boolean) => void;
    readonly onCreatePlaylist: () => Promise<void> | void;
    readonly onSelectPlaylist: (playlistId: string) => Promise<void> | void;
    readonly playlistId?: string; // ID of playlist (for PlaylistPage)
}

export const PlaylistMenu: FC<IPlaylistMenu> = ({ isOpen, setIsOpen, onCreatePlaylist, onSelectPlaylist, playlistId }) => {
    const user = useAppSelector(selectUser);
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);

    const renderPlaylists = (items: ISimplifiedPlaylist[]) => {
        const userPlaylists = items.filter(item => item.owner?.id === user?.id && item.id !== playlistId);

        return userPlaylists.map(playlist => 
            <button 
                key={playlist.id} 
                className={styles["menu-playlists-button"]}
                onClick={async () => onSelectPlaylist(playlist.id)}
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
    }

    return (
        <DragDownMenu
            className={styles["menu-playlists"]}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className={styles["menu-playlists-body"]}>
                <FilledButton onClick={async () => await onCreatePlaylist()}>
                    <Paragraph>
                        New Playlist
                    </Paragraph>
                </FilledButton>       
                <div className={styles["menu-playlists-content"]}>
                    {renderPlaylists(libraryPlaylists)}
                </div>
            </div>
        </DragDownMenu>
    )
}