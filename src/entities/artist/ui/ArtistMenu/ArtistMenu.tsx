import { FC } from "react";
import styles from "./style.module.scss";
import { BottomSheet, ContextMenu, MenuButton } from "shared/ui";
import { ArtistIcon } from "shared/assets";
import { useWindowDimensions } from "shared/lib";
import { ISimplifiedArtist } from "shared/api/artist";
import clsx from "clsx";


interface IArtistMenu {
    readonly isOpen: boolean;
    readonly setIsOpen: (state: boolean) => void;
    readonly artists: ISimplifiedArtist[]
    /** Additional styles */
    readonly className?: string;
}

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