import { FC } from "react";
import { Paragraph } from "shared/ui";
import { ISimplifiedTrack, ITrack } from "shared/api/track";
import { Link } from "react-router";
import { IAlbum } from "shared/api/album";
import { ArtistList } from "entities/artist";
import { usePlaybackAdapter } from "entities/playback";
import "./TrackItem.scss";
import { More, PlaceholderImage } from "shared/assets";

export interface ITrackItem {
    /** Track to render */
    readonly track: ITrack | ISimplifiedTrack;
    /** Provide album if pass ISimplifiedTrack where field album doesn't exist */
    readonly defaultAlbum?: IAlbum;
    /** URI of context to play the song */
    readonly contextUri?: string,
}

export const TrackItem: FC<ITrackItem> = ({ track, defaultAlbum, contextUri }) => {
    const { name, artists, album } = track as ITrack;
    const { adapter } = usePlaybackAdapter();

    const handlePlay = async () => {
        if (contextUri) {
            adapter.play({
                context_uri: contextUri,
                offset: { uri: track.uri }
            })
        }
    }
    
    return (
        <div className="track-item item" onClick={handlePlay}>
            <img 
                src={
                    album?.images[0]?.url ?? 
                    defaultAlbum?.images[0]?.url ?? 
                    PlaceholderImage
                } 
                className="item-image"    
            />
            <div className="item-content">
                <Link to={`/albums/${album?.id ?? defaultAlbum?.id ?? ""}`}>
                    <Paragraph className="item-name">
                        {name ?? ""}
                    </Paragraph>
                </Link>
                <div className="item-artist-container">
                    <ArtistList artists={artists} />
                </div>
            </div>
            <button className="item-button">
                <More width={40} height={40} />
            </button>
        </div>
    )
}