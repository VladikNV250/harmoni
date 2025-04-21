import { FC } from "react";
import {
    BottomSheet,
    ContextMenu,
    MenuButton
} from "shared/ui";
import { ArtistIcon } from "shared/assets";
import { useWindowDimensions } from "shared/lib";
import { ISimplifiedArtist } from "shared/api/artist";
import clsx from "clsx";
import styles from "./style.module.scss";


interface IArtistMenu {
    /** Controls whether the artist menu is visible */
    readonly isOpen: boolean;
    /** Callback to toggle the menu's visibility */
    readonly setIsOpen: (state: boolean) => void;
    /** A list of artists to display in the menu */
    readonly artists: ISimplifiedArtist[]
    /** Additional styles */
    readonly className?: string;
}

/**
 * @component ArtistMenu
 * @description Renders a responsive menu with a list of artists.
 * - On desktop (>=768): shows a dropdown context menu.
 * - On mobile: shows a bottom sheet. 
 * 
 * Typically used for showing related artists or selectable artist actions.
 * 
 * @example
 * <ArtistMenu
 *   isOpen={isMenuOpen}
 *   setIsOpen={setMenuOpen}
 *   artists={artistList}
 * />
 */
export const ArtistMenu: FC<IArtistMenu> = ({ isOpen, setIsOpen, artists, className }) => {
    const { width } = useWindowDimensions();

    const renderArtists = (artists: ISimplifiedArtist[]) => {
        return artists.map(artist =>
            <MenuButton
                key={artist.id}
                Icon={ArtistIcon}
                text={artist.name ?? ""}
                buttonType="link-button"
                to={`/artists/${artist.id}`}
                onClick={() => setIsOpen(false)}
            />
        )
    }

    return (
        width >= 768
            ?
            <ContextMenu
                className={className}
                isMenuOpen={isOpen}
                setIsMenuOpen={setIsOpen}
                isNested
            >
                {renderArtists(artists)}
            </ContextMenu>
            :
            <BottomSheet
                className={clsx(
                    styles["artist-menu"],
                    className
                )}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <div className={styles["artist-list"]}>
                    {renderArtists(artists)}
                </div>
            </BottomSheet>
    )
}