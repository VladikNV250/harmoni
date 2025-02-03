import { FC } from "react";
import { Paragraph } from "shared/ui";
import More from "shared/assets/icons/more-big.svg?react";
import { ISimplifiedTrack, ITrack } from "shared/api/track";
import PlaceholderImage from "shared/assets/placeholder/placeholder.jpg";
import { Link } from "react-router";
import { IAlbum } from "shared/api/album";
import "./TrackItem.scss";
import { ArtistList } from "entities/artist";

export interface ITrackItem {
    /** Track to render */
    readonly track: ITrack | ISimplifiedTrack;
    /** Provide album if pass ISimplifiedTrack where field album doesn't exist */
    readonly defaultAlbum?: IAlbum;
}

export const TrackItem: FC<ITrackItem> = ({ track, defaultAlbum }) => {
    const { name, artists, album } = track as ITrack;
    
    return (
        <div className="track-item item">
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