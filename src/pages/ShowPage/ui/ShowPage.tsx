import { 
    CSSProperties, 
    FC, 
    useEffect, 
    useState 
} from "react";
import { useParams } from "react-router";
import { 
    fetchShow, 
    IShow 
} from "shared/api/show";
import { 
    useAppDispatch, 
    useAppSelector, 
    useColor, 
    useTabs 
} from "shared/lib";
import { 
    PlaceholderImage, 
    Sort 
} from "shared/assets";
import { 
    Description, 
    Loader, 
    NavigationTabs, 
    SearchInput, 
    Title 
} from "shared/ui";
import { 
    getUserInfo, 
    selectUser, 
    selectUserLoading 
} from "entities/user";
import { 
    getLibraryShows, 
    selectLibraryLoading, 
} from "features/library";
import { EpisodeItem } from "entities/episode";
import { usePlaybackAdapter } from "entities/playback";
import { ISimplifiedEpisode } from "shared/api/episode";
import { fetchPlaybackState } from "entities/playback/api/playback";
import { ShowControlPanel } from "./ShowControlPanel/ShowControlPanel";
import styles from "./style.module.scss";


const ShowPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const [show, setShow] = useState<IShow | null>(null);
    const [tabs, setTabs] = useState<string[]>([]);
    const { activeTab, chooseTab } = useTabs<string, "Episodes">("Episodes")
    const [showLoading, setShowLoading] = useState(false);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);
    const color = useColor(show?.images[0]?.url ?? PlaceholderImage);
    const { setApiPlayback } = usePlaybackAdapter();
    
    useEffect(() => {
        if (user === null) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user])
    

    useEffect(() => {
        (async () => {
            try {
                setShowLoading(true);
                if (id) {
                    const show: IShow = await fetchShow(id);
                    
                    if (show.episodes.items.length > 0)
                        setTabs(tabs => Array.from(new Set([...tabs, "Episodes"])))
                    if (show.description) 
                        setTabs(tabs => Array.from(new Set([...tabs, "About"])))

                    setShow(show);
                } 

                dispatch(getLibraryShows());
                setApiPlayback?.(await fetchPlaybackState());
            } catch (e) {
                console.error(e);
            } finally {
                setShowLoading(false);
            }
        })()
    }, [id, setApiPlayback, dispatch]);

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
            <Loader loading={showLoading || libraryLoading || userLoading} />
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
            <ShowControlPanel show={show} />
            <NavigationTabs<string>
                tabs={tabs}
                activeTab={activeTab}
                chooseTab={chooseTab}
                className={styles["show-tabs"]}
            />
            {activeTab === "Episodes" &&
            <div className={styles["show-items-container"]}>
            {renderEpisodes(show?.episodes.items ?? [])}
            </div>}
            {activeTab === "About" &&
            <div className={styles["show-description-container"]}>
                <Description className={styles["show-description"]}>
                    {show?.description ?? ""}
                </Description>
            </div>}
        </div>
    )
}

export default ShowPage;