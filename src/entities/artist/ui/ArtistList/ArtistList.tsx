import { FC } from "react";
import { Link } from "react-router";
import {
    IArtist,
    ISimplifiedArtist
} from "shared/api/artist";
import clsx from "clsx";
import styles from "./style.module.scss";

interface IArtistList {
    /** Artists array */
    readonly artists?: ISimplifiedArtist[] | IArtist[];
    /** Additional styles */
    readonly className?: string,
}

/**
 * @component ArtistList
 * @description Сomponent that renders links to artists separated by commas
 */
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