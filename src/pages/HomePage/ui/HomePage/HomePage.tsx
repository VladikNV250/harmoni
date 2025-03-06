import { FC, useState } from "react";
import { useTheme } from "entities/theme";
import { TagItem } from "../TagItem/TagItem";
import { AdjustContextMenu } from "../AdjustContextMenu/AdjustContextMenu";
import { Adjust } from "shared/assets";
import clsx from "clsx";
import { useAppSelector } from "shared/lib";
import { selectFeedLoading, TFeedFilter } from "entities/feed";
import { Catalogue } from "../Catalogue/Catalogue";
import { UserTrackList } from "../UserTrackList/UserTrackList";
import { Loader } from "shared/ui";
import styles from "./style.module.scss";

const HomePage: FC = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [catalogueType, setCatalogueType] = useState<TFeedFilter>("all");
    const loading = useAppSelector(selectFeedLoading);
    
    return (
        <div className={styles["home"]}>
            <Loader loading={loading} />
            <AdjustContextMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className={styles["filter-bar"]}>
                <div 
                    className={clsx(
                        styles["tags-container"], 
                        theme && styles[theme]
                    )}
                >
                    <div className={styles["tags-slider"]}>
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
                <button 
                    className={styles["button-adjust"]} 
                    onClick={() => setIsOpen(true)}
                >
                    <Adjust width={40} height={40} className={styles["icon"]} />
                </button>                
            </div>
            <UserTrackList />
            <Catalogue type={catalogueType} />
        </div>
    )
}

export default HomePage;