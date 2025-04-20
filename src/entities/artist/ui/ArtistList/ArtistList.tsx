import clsx from "clsx";
import { FC } from "react";
import { Link } from "react-router";
import { IArtist, ISimplifiedArtist } from "shared/api/artist";
import styles from "./style.module.scss";

interface IArtistList {
    /** Artists array */
    readonly artists?: ISimplifiedArtist[] | IArtist[];
    /** Additional classes */
    readonly className?: string,
}

export const ArtistList: FC<IArtistList> = ({ artists = [], className }) => {
    return artists.length > 0 && artists.map((artist, index) =>
        <Link 
            key={artist.id} 
            to={`/artists/${artist.id}`} 
            className={clsx(styles["item-link-artist"], className)}
        >
            {artist.name + (index !== artists.length - 1 ? "," : "")}
        </Link>
    )
}