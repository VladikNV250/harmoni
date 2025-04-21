import {
    FC,
    MouseEvent,
    useState
} from "react";
import { Link } from "react-router";
import { ArtistList } from "entities/artist";
import { usePlaybackAdapter } from "entities/playback";
import {
    Description,
    Paragraph
} from "shared/ui";
import {
    ISimplifiedTrack,
    ITrack
} from "shared/api/track";
import { IAlbum } from "shared/api/album";
import {
    More,
    PauseSimple,
    PlaceholderImage,
    PlaySimple
} from "shared/assets";
import { calculateDuration } from "shared/lib";
import { TrackMenu } from "../TrackMenu/TrackMenu";
import { toast } from "react-toastify";
import clsx from "clsx";
import styles from "./style.module.scss";


export interface ITrackItem {
    /** Track to render */
    readonly track: ITrack | ISimplifiedTrack;
    /** Sequence number in a playlist or album */
    readonly sequenceNumber: number;
    /** Whether to show track image */
    readonly showImage?: boolean;
    /** Whether to show track album */
    readonly showAlbum?: boolean;
    /** Provide album if pass ISimplifiedTrack where field album doesn't exist */
    readonly defaultAlbum?: IAlbum;
    /** URI of context to play the song */
    readonly contextUri?: string,
    /** PlaylistID for removing track from this playlist */
    readonly playlistId?: string,
}

/**
 * @component TrackItem
 * @description Component responsible for rendering a single track in a playlist, album, or other context.
 * It includes the track's name, artist(s), album (optional), play controls, and options to interact with the track.
 * 
 * The component provides functionally for:
 * - Playing the track.
 * - Showing track details such as album and artists.
 * - Providing a menu with additional options for the track (e.g., adding/removing from the playlists).  
 */
export const TrackItem: FC<ITrackItem> = ({ track, sequenceNumber, showImage = true, showAlbum = false, defaultAlbum, contextUri, playlistId }) => {
    const { name, artists, album, id } = track as ITrack;
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
    const { adapter } = usePlaybackAdapter();

    /**
     * @function handlePlay
     * @description Responsible for playing or resuming playback of the track.
     * If this track is already playing - resume, otherwise - play with context uri from props.
     */
    const handlePlay = async () => {
        try {
            if (!contextUri) throw new Error("ContextURI doesn't exist.");

            if (adapter.getTrackID() === track.id) {
                await adapter.resume();
            } else {
                await adapter.play({
                    context_uri: contextUri,
                    offset: { uri: track.uri }
                })
            }
        } catch (e) {
            toast.error("Something went wrong. Player may not be available at this time.")
            console.error("PLAY", e);
        }
    }

    const openMenu = (e: MouseEvent) => {
        e.stopPropagation();
        setIsOpenMenu(!isOpenMenu);
    }

    return (
        <div
            className={styles["track"]}
            onClick={async () => await handlePlay()}>
            <TrackMenu
                isOpen={isOpenMenu}
                setIsOpen={setIsOpenMenu}
                track={track}
                playlistId={playlistId}
            />
            <button
                className={clsx(
                    styles["track-button"],
                    styles["play"],
                )}
                onClick={async (e) => {
                    e.stopPropagation();
                    await handlePlay();
                }}
            >
                {adapter.getTrackID() === track.id && adapter.getIsPlaying()
                    ?
                    <PauseSimple width={40} height={40} />
                    :
                    <PlaySimple width={40} height={40} />}
            </button>
            <Paragraph className={styles["track-number"]}>
                {`${sequenceNumber}`}
            </Paragraph>
            <img
                src={
                    album?.images[0]?.url ??
                    defaultAlbum?.images[0]?.url ??
                    PlaceholderImage
                }
                className={clsx(
                    styles["track-image"],
                    !showImage && styles["hidden"],
                )}
            />
            <div className={styles["track-content"]}>
                <Link
                    onClick={e => e.stopPropagation()}
                    to={`/albums/${album?.id ?? defaultAlbum?.id ?? ""}`}>
                    <Paragraph className={clsx(
                        styles["track-name"],
                        adapter.getTrackID() === id && styles["playing"]
                    )}>
                        {name ?? ""}
                    </Paragraph>
                </Link>
                <div className={styles["track-artist-container"]}>
                    <ArtistList artists={artists} />
                </div>
            </div>
            <Link
                to={`/albums/${album?.id ?? defaultAlbum?.id ?? ""}`}
                className={clsx(
                    styles["track-album"],
                    !showAlbum && styles["hidden"]
                )}
            >
                <Description>
                    {album?.name ?? defaultAlbum?.name ?? ""}
                </Description>
            </Link>
            <Description className={styles["track-duration"]}>
                {calculateDuration(track?.duration_ms ?? 0, "colon")}
            </Description>
            <button
                className={styles["track-button"]}
                onClick={openMenu}
            >
                <More width={40} height={40} />
            </button>
        </div>
    )
}