import { 
    CSSProperties, 
    FC, 
    useEffect, 
    useState 
} from "react";
import { useParams } from "react-router";
import { 
    fetchArtist, 
    fetchArtistAlbums, 
    fetchArtistTopTracks, 
    IArtist 
} from "shared/api/artist";
import { 
    useAppDispatch, 
    useAppSelector, 
    useColor, 
    useTabs 
} from "shared/lib";
import { 
    Description, 
    Loader, 
    NavigationTabs, 
    Title 
} from "shared/ui";
import { 
    getUserInfo, 
    selectUser, 
    selectUserLoading 
} from "entities/user";
import { 
    getLibraryArtists, 
    selectLibraryLoading 
} from "features/library";
import { ITrack } from "shared/api/track";
import { ISimplifiedAlbum } from "shared/api/album";
import { AlbumPreview } from "entities/album";
import { TrackItem } from "entities/track";
import { usePlaybackAdapter } from "entities/playback";
import { fetchPlaybackState } from "entities/playback/api/playback";
import { PlaceholderProfileImage } from "shared/assets";
import { ArtistControlPanel } from "../ArtistControlPanel/ArtistControlPanel";
import { toast } from "react-toastify";
import styles from "./style.module.scss";


const ArtistPage: FC = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState<IArtist | null>(null);
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [albums, setAlbums] = useState<{[key: string]: ISimplifiedAlbum[]}>({
        "album": [],
        "single": [],
        "compilation": [],
    });
    const [artistLoading, setArtistLoading] = useState(false);
    const [tabs, setTabs] = useState<string[]>([]);
    const { activeTab, chooseTab } = useTabs<string, "Top Tracks">("Top Tracks");
    const dispatch = useAppDispatch();
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);
    const color = useColor(artist?.images[0]?.url ?? PlaceholderProfileImage);
    const { setApiPlayback } = usePlaybackAdapter();


    useEffect(() => {
        if (user === null) {
            dispatch(getUserInfo());
        }
    }, [dispatch, user])

    useEffect(() => {
        (async () => {
            try {
                setArtistLoading(true);
                if (id) {
                    setArtist(await fetchArtist(id));
                    dispatch(getLibraryArtists());
                    setApiPlayback?.(await fetchPlaybackState());


                    const tracks = (await fetchArtistTopTracks(id)).tracks;
                    const albums = (await fetchArtistAlbums(id, {include_groups: "album"})).items;
                    const singles = (await fetchArtistAlbums(id, {include_groups: "single"})).items;
                    const compilations = (await fetchArtistAlbums(id, {include_groups: "compilation,appears_on"})).items;

                    if (tracks.length > 0) {
                        setTracks(tracks);
                        setTabs(tabs => [...tabs, "Top Tracks"]);
                    }
                    if (albums.length > 0) {
                        setAlbums(prevState => ({
                            ...prevState,
                            "album": albums
                        }));
                        setTabs(tabs => Array.from(new Set([...tabs, "Albums"])));
                    }
                    if (singles.length > 0) {
                        setAlbums(prevState => ({
                            ...prevState,
                            "single": singles,
                        }));
                        setTabs(tabs => Array.from(new Set([...tabs, "Singles"])));
                    }
                    if (compilations.length > 0) {
                        setAlbums(prevState => ({
                            ...prevState,
                            "compilation": compilations,
                        }));
                        setTabs(tabs => Array.from(new Set([...tabs, "Compilations and Appears On"])));
                    }
                } 
            } catch (e) {
                console.error(e);
                toast.error("Something went wrong. Try to reload the page.");
            } finally {
                setArtistLoading(false);
            }
        })()

        return () => setTabs([]);
    }, [id, dispatch, setApiPlayback])


    const displayFollowers = (followers: number = 0): string => {
        if (followers === 0) return "";

        const formatter = Intl.NumberFormat("en");
        return formatter.format(followers) + " followers";
    }

    const renderTracks = (tracks: ITrack[]) => {
        return tracks.length > 0 && tracks.map((track) =>
            <TrackItem 
                key={track.id}
                track={track}
            />
        )
    }

    const renderAlbums = (albums: ISimplifiedAlbum[]) => {
        return albums.length > 0 && albums.map(album =>
            <AlbumPreview 
                key={album.id}
                album={album} 
                description="date-year"
            />
        )
    }

    return (
        <div 
            className={styles["artist"]} 
            style={{'--color': color} as CSSProperties}>
            <Loader loading={artistLoading || libraryLoading || userLoading} />
            <div className={styles["artist-image-container"]}>
                <img 
                    src={artist?.images[0].url || PlaceholderProfileImage} 
                    className={styles["artist-image"]} 
                />
                <div className={styles["artist-body"]}>
                    <Title className={styles["artist-name"]}>
                        {artist?.name ?? ""}
                    </Title>
                    <Description className={styles["artist-total"]}>
                        {displayFollowers(artist?.followers.total)}
                    </Description>
                </div>
            </div>
            <ArtistControlPanel artist={artist} />
            <NavigationTabs
                tabs={tabs}
                activeTab={activeTab}
                chooseTab={chooseTab}
                className={styles["artist-tabs"]}
            />
            <div className={styles["artist-content"]}>
                {activeTab === "Top Tracks" &&
                <div className={styles["artist-items-container"]}>
                    {renderTracks(tracks ?? [])}
                </div>}
                {activeTab === "Albums" &&
                <div className={styles["artist-albums-container"]}>
                    {renderAlbums(albums.album ?? [])}
                </div>}
                {activeTab === "Singles" &&
                <div className={styles["artist-albums-container"]}>
                    {renderAlbums(albums.single ?? [])}
                </div>}
                {activeTab === "Compilations and Appears On" &&
                <div className={styles["artist-albums-container"]}>
                    {renderAlbums(albums.compilation ?? [])}
                </div>}
            </div>
        </div>
    )
}

export default ArtistPage;