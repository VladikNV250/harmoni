import { FC } from "react";
import { Link } from "react-router";
import { ArtistList } from "entities/artist";
import { usePlaybackAdapter } from "entities/playback";
import { PlaceholderImage } from "shared/assets";
import { ITrack } from "shared/api/track";
import { ISimplifiedAlbum } from "shared/api/album";
import {
    IArtist,
    ISimplifiedArtist
} from "shared/api/artist";
import { ISimplifiedPlaylist } from "shared/api/playlist";
import { ISimplifiedShow } from "shared/api/show";
import { ISimplifiedEpisode } from "shared/api/episode";
import { Paragraph } from "shared/ui";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";


interface ISearchItem {
    /** Object of searched item (e.g., track, album, artist, playlist etc.) */
    readonly item: ITrack | ISimplifiedAlbum | IArtist | ISimplifiedPlaylist | ISimplifiedShow | ISimplifiedEpisode;
    /** List of artists. Passed separately since `item` stores artists differently based on its type. */
    readonly artists?: ISimplifiedArtist[];
    /** Publisher name. Used for items like shows and episodes that don't have artists. */
    readonly publisher?: string;
}

/**
 * @components SearchItem
 * @description Component that renders a single search result item (track, album, artist, playlist, show, or episode).
 * Displays cover image, name, type of item, artist list or publisher, and allows playback on click. 
 */
export const SearchItem: FC<ISearchItem> = ({ item, artists, publisher }) => {
    const { adapter } = usePlaybackAdapter();

    const playItem = async () => {
        try {
            const trackUri = item.type === "track" ? item.uri : '';
            const contextUri = item.type === "track" ? item.album.uri : item.uri;

            if (!contextUri) throw new Error("contextURI doesn't exist.");

            if (trackUri) {
                await adapter.play({
                    context_uri: contextUri,
                    offset: { uri: trackUri }
                })
            } else {
                await adapter.play({
                    context_uri: contextUri
                })
            }
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const getItemLink = () => {
        switch (item.type) {
            case "track": return "/albums/" + item.album.id;
            case "album": return "/albums/" + item.id;
            case "artist": return "/artists/" + item.id;
            case "playlist": return "/playlists/" + item.id;
            case "show": return "/shows/" + item.id;
            case "episode": return "/episodes/" + item.id;
            default: return "/";
        }
    }

    return (
        <div
            className={styles["search-item"]}
            onClick={async () => await playItem()}>
            <img
                src={
                    item.type === "track"
                        ? item.album.images?.[0]?.url || PlaceholderImage
                        : item.images?.[0]?.url || PlaceholderImage
                }
                className={clsx(
                    item.type === "artist"
                        ? styles["search-item-image-circle"]
                        : styles["search-item-image"]
                )}
            />
            <div className={styles["search-item-body"]}>
                <Link
                    className={styles["search-item-name"]}
                    to={getItemLink()}
                    onClick={e => e.stopPropagation()}
                >
                    {item.name}
                </Link>
                <div className={styles["search-item-content"]}>
                    <Paragraph className={styles["search-item-type"]}>
                        {
                            item.type === "track" ? "Song" :
                                item.type === "album" ? item.album_type :
                                    item.type
                        }
                    </Paragraph>
                    {(artists?.length ?? 0) > 0 &&
                        <>
                            <Paragraph>
                                &#183;
                            </Paragraph>
                            <ArtistList artists={artists} />
                        </>}
                    {publisher &&
                        <>
                            <Paragraph>
                                &#183;
                            </Paragraph>
                            <Paragraph className={styles["search-item-publisher"]}>
                                {publisher}
                            </Paragraph>
                        </>}
                </div>
            </div>
        </div>
    )
}