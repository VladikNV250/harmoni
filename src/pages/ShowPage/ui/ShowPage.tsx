import { CSSProperties, FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchShow, IShow } from "shared/api/show";
import { useColor } from "shared/lib";
import PlaceholderImage from 'shared/assets/placeholder/placeholder.jpg';
import Sort from "shared/assets/icons/sort-big.svg?react";
import { Description, Loader, SearchInput, Tabs, Title } from "shared/ui";
import { EpisodeItem } from "entities/episode";
import { PagePlaybackControl } from "entities/playback";
import { ISimplifiedEpisode } from "shared/api/episode";
import styles from "./style.module.scss";


const ShowPage: FC = () => {
    const { id } = useParams();
    const [show, setShow] = useState<IShow | null>(null);
    const [tabs, setTabs] = useState<string[]>([]);
    const [currentTab, setCurrentTab] = useState("Episodes");
    const [loading, setLoading] = useState(false);
    const color = useColor(show?.images[0]?.url ?? PlaceholderImage);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (id) {
                    const show: IShow = await fetchShow(id);
                    
                    if (show.episodes.items.length > 0)
                        setTabs(tabs => Array.from(new Set([...tabs, "Episodes"])))
                    if (show.description) 
                        setTabs(tabs => Array.from(new Set([...tabs, "About"])))

                    setShow(show);
                } 

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })()
    }, [id]);

    const renderEpisodes = (episodes: ISimplifiedEpisode[]) => {
        return episodes.length > 0 && episodes.map(episode =>
            <EpisodeItem 
                key={episode.id} 
                episode={episode} 
                showURI={show?.uri ?? ""}
            />
        )
    }

    return (
        <div 
            className={styles["show"]} 
            style={{'--color': color} as CSSProperties}
        >
            <Loader loading={loading} />
            <header className={styles["show-header"]}>
                <SearchInput 
                    placeholder="Search episode" 
                    className={styles["header-input"]} 
                />
                <button className={styles["header-button"]}>
                    <Sort width={40} height={40} />
                </button>   
            </header>
            <div className={styles["show-image-container"]}>
                <img 
                    src={show?.images[0].url || PlaceholderImage} 
                    className={styles["show-image"]} 
                />
                <div className={styles["show-body"]}>
                    <Title className={styles["show-name"]}>{show?.name ?? ""}</Title>
                    <Description>
                        {show?.publisher ?? ""}
                    </Description>
                </div>
            </div>
            <PagePlaybackControl 
                className={styles["show-control-panel"]}
                contextUri={show?.uri}
            />
            <Tabs
                tabs={tabs}
                currTab={currentTab}
                setTab={setCurrentTab}
                className={styles["show-tabs"]}
            />
            {currentTab === "Episodes" &&
            <div className={styles["show-items-container"]}>
            {renderEpisodes(show?.episodes.items ?? [])}
            </div>}
            {currentTab === "About" &&
            <div className={styles["show-description-container"]}>
                <Description className={styles["show-description"]}>
                    {show?.description ?? ""}
                </Description>
            </div>}
        </div>
    )
}

export default ShowPage;