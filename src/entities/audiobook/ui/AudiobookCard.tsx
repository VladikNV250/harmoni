import { FC } from "react";
import "./AudiobookCard.scss";
import { IAudiobook } from "../model/types";
import { useNavigate } from "react-router";
import placeholderImage from "shared/assets/placeholder/placeholder.jpg";
import Audiobook from "shared/assets/icons/audiobook.svg?react";
import { Text } from "shared/ui";
import Play from "shared/assets/icons/play-big.svg?react";

interface IAudiobookCard {
    audiobook: IAudiobook;
}

export const AudiobookCard: FC<IAudiobookCard> = ({ audiobook }) => {
    const { preview, name, author } = audiobook;
    const navigate = useNavigate();

    return (
        <div className="audiobook-card" >
            <div className="audiobook-content" onClick={() => navigate("/library")}>
                <img src={preview || placeholderImage} className="audiobook-image" />
                <div className="audiobook-name-container">
                    <Audiobook width={20} height={20} className="audiobook-icon" />
                    <Text className="audiobook-name">{name}</Text>
                </div>
                <p className="audiobook-author">{author}</p>
            </div>
            <button className="audiobook-button">
                <Play width={40} height={40} />
                {/* <Pause width={40} height={40} /> */}
            </button>
        </div>
    )
}