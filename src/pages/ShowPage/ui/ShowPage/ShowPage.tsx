import { 
    ChangeEvent,
    CSSProperties, 
    FC, 
    useCallback, 
    useEffect, 
    useState 
} from "react";
import { 
    useNavigate, 
    useParams 
} from "react-router";
import { 
    fetchShow, 
    IShow 
} from "shared/api/show";
import { 
    useAppDispatch, 
    useAppSelector, 
    useColor, 
    useDebounce, 
    useTabs 
} from "shared/lib";
import { 
    ArrowLeft, 
    PlaceholderImage 
} from "shared/assets";
import { 
    Description, 
    DesktopTitle, 
    ExpandableSearchInput, 
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
import { fetchPlaybackState, usePlaybackAdapter } from "entities/playback";
import { ISimplifiedEpisode } from "shared/api/episode";
import { ShowControlPanel } from "../ShowControlPanel/ShowControlPanel";
import styles from "./style.module.scss";


const ShowPage: FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [show, setShow] = useState<IShow | null>(null);
    const [showLoading, setShowLoading] = useState(false);
    const [tabs, setTabs] = useState<string[]>([]);
    const { activeTab, chooseTab } = useTabs<string, "Episodes">("Episodes")
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 300);
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setValue(value);
    }

    const renderEpisodes = useCallback((episodes: ISimplifiedEpisode[]) => {
        if (episodes.length > 0) {
            if (debouncedValue) {
                return episodes.map(episode => {
                    const lowerName = episode.name?.toLowerCase();
                    const lowerValue = (debouncedValue as string).toLowerCase();
                    const isMatch = lowerName?.includes(lowerValue);
                    return isMatch && (
                        <EpisodeItem 
                            key={episode.id} 
                            episode={episode} 
                            showURI={show?.uri ?? ""}
                        />
                    )
                })
            } else {
                return episodes.map(episode => {
                    return (
                        <EpisodeItem 
                            key={episode.id} 
                            episode={episode} 
                            showURI={show?.uri ?? ""}
                        />
                    )
                })
            }
        }
    }, [debouncedValue, show?.uri])

    return (
        <div 
            className={styles["show"]} 
            style={{'--color': color} as CSSProperties}
        >
            <Loader loading={showLoading || libraryLoading || userLoading} />
            <header className={styles["show-header"]}>
                <button 
                    className={styles["header-button"]}
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft width={40} height={40} />
                </button>
                <SearchInput 
                    value={value}
                    onChange={handleChange}
                    placeholder="Search episode" 
                    className={styles["show-search"]} 
                />  
            </header>
            <div className={styles["show-image-container"]}>
                <img 
                    src={show?.images[0].url || PlaceholderImage} 
                    className={styles["show-image"]} 
                />
                <div className={styles["show-body"]}>
                    <Title className={styles["show-name"]}>{show?.name ?? ""}</Title>
                    <Description className={styles["show-publisher"]}>
                        {show?.publisher ?? ""}
                    </Description>
                    <Title className={styles["show-about"]}>
                        About
                    </Title>
                    <Description className={styles["show-description__desktop"]}>
                        {show?.description ?? ""}
                    </Description>
                </div>
            </div>
            <div className={styles["show-content"]}>
                <DesktopTitle className={styles["show-name__desktop"]}>
                    {show?.name ?? ""}
                </DesktopTitle>
                <Description className={styles['show-publisher__desktop']}>
                    {show?.publisher ?? ""}
                </Description>
                <div className={styles["show-control-panel"]}>
                    <ShowControlPanel show={show} />
                    <ExpandableSearchInput 
                        value={value}
                        onChange={handleChange}
                        placeholder="Search episode" 
                        direction="left"
                        className={styles["show-search__desktop"]}
                    />
                </div>
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
        </div>
    )
}

export default ShowPage;