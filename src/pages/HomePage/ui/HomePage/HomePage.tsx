import { FC, useState } from "react";
import { useTheme } from "entities/theme";
import { TagItem } from "../TagItem/TagItem";
import { AdjustContextMenu } from "../AdjustContextMenu/AdjustContextMenu";
import Adjust from "shared/assets/icons/adjust-big.svg?react";
import clsx from "clsx";
import { useAppSelector } from "shared/lib";
import { selectFeedLoading, TFeedFilter } from "entities/feed";
import { Loader } from "shared/ui/loaders/loader";
import { Catalogue } from "../Catalogue/Catalogue";
import { UserTrackList } from "../UserTrackList/UserTrackList";
import "./HomePage.scss";

export const HomePage: FC = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [catalogueType, setCatalogueType] = useState<TFeedFilter>("all");
    const loading = useAppSelector(selectFeedLoading);
    
    return (
        <div className="home">
            <Loader loading={loading} />
            <AdjustContextMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="filter-bar">
                <div className={clsx("tags-container", theme)}>
                    <div className="tags-slider">
                        <TagItem 
                            tag="Music"
                            active={catalogueType === "music"}
                            setType={(type: TFeedFilter = "music") => setCatalogueType(type)}
                        />
                        <TagItem 
                            tag="Podcasts"
                            active={catalogueType === "podcasts"}
                            setType={(type: TFeedFilter = "podcasts") => setCatalogueType(type)} 
                        />
                    </div>
                </div>
                <button className="button-adjust" onClick={() => setIsOpen(true)}>
                    <Adjust width={40} height={40} className="icon" />
                </button>                
            </div>
            <UserTrackList />
            <Catalogue type={catalogueType} />
        </div>
    )
}