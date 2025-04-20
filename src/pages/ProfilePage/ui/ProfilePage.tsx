import { 
    CSSProperties,
    FC, 
    useEffect 
} from "react";
import { 
    useAppDispatch, 
    useAppSelector, 
    useColor
} from "shared/lib";
import { 
    getUserInfo, 
    selectUser, 
    selectUserLoading  
} from "entities/user";
import { 
    Description, 
    Loader, 
    OutlinedButton, 
    Paragraph, 
    Subtitle, 
    Switch, 
    Title 
} from "shared/ui";
import { 
    feedSlice, 
    selectFeedSettings 
} from "entities/feed";
import { 
    Logo, 
    PlaceholderProfileImage, 
} from "shared/assets";
import { 
    fetchPlaybackState, 
    usePlaybackAdapter 
} from "entities/playback";
import { 
    getLibraryArtists, 
    getLibraryPlaylists, 
    selectFollowedArtists, 
    selectLibraryLoading, 
    selectSavedPlaylists 
} from "features/library";
import { useNavigate } from "react-router";
import { useTheme } from "entities/theme";
import clsx from "clsx";
import styles from "./style.module.scss";


const ProfilePage: FC = () => {
    const { theme, toggleTheme } = useTheme();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const libraryPlaylists = useAppSelector(selectSavedPlaylists);
    const libraryArtists = useAppSelector(selectFollowedArtists);
    const libraryLoading = useAppSelector(selectLibraryLoading);
    const user = useAppSelector(selectUser);
    const userLoading = useAppSelector(selectUserLoading);
    const feedSettings = useAppSelector(selectFeedSettings);
    const { setUpdateAfterEveryReload } = feedSlice.actions;
    const { setApiPlayback } = usePlaybackAdapter();
    const color = useColor(user?.images?.[0]?.url ?? PlaceholderProfileImage, true, theme);

    const logoutHandler = () => {
        localStorage.clear();  
        navigate("/login");
    }

    useEffect(() => {
        dispatch(getUserInfo());
        dispatch(getLibraryPlaylists());
        dispatch(getLibraryArtists());
        (async () => {
            setApiPlayback?.(await fetchPlaybackState());
        })()
    }, [dispatch, setApiPlayback])

    return (
        <div className={styles["profile"]} style={{"--color": color} as CSSProperties}>
            <Loader loading={userLoading || libraryLoading} />
            <div 
                className={clsx(
                    styles["profile-info"],
                    theme && styles[theme]
                )}
            >
                <img 
                    src={user?.images[0]?.url ?? PlaceholderProfileImage} 
                    className={styles["profile-info-avatar"]} 
                />
                <div className={styles["profile-info-content"]}>
                    <div className={styles["profile-info-header"]}>
                        <Title className={styles["profile-info-name"]}>
                            {user?.display_name ?? ""}
                        </Title>
                    </div>
                    <div className={styles["profile-info-body"]}>
                        {(user?.followers?.total ?? 0) > 0 &&
                        <>
                            <p className={styles["profile-info-text"]}>
                                <Description className={styles["white"]}>
                                    {`${user?.followers.total ?? 0}`}
                                </Description>
                                <Description>followers</Description>
                            </p>
                            <p className={styles["profile-info-text"]}>&#x2022;</p>
                        </>
                        }
                        {((libraryPlaylists.length ?? 0) > 0 || (libraryArtists.length ?? 0) > 0) &&
                        <p className={styles["profile-info-text"]}>
                            <Description className={styles["white"]}>
                                {`${libraryPlaylists.length + libraryArtists.length}`}
                            </Description>
                            <Description>following</Description>
                        </p>
                        }
                    </div>
                    <Description className={styles["profile-info-id"]}>
                        {user?.id ?? ""}
                    </Description>
                </div>
            </div>
            <div 
                className={clsx(
                    styles["profile-plan-info"],
                    theme && styles[theme]
                )}
            >
                <div className={styles["profile-plan-header"]}>
                    <img src={Logo} className={styles["profile-plan-logo"]} />
                    <p className={styles["profile-plan-title"]}>Current Plan</p>
                </div>
                <Subtitle className={styles["profile-plan-status"]}>
                    {user?.product === "premium" ? "Premium - Individual" : "Free"}
                </Subtitle>
                <Description className={styles["profile-plan-price"]}>
                    {user?.product === "premium" ? "$10.99 / month" : "$0.0 / month"}
                </Description>
            </div>
            <div 
                className={clsx(
                    styles["profile-settings"],
                    theme && styles[theme]
                )}
            >
                <header className={styles["profile-settings-header"]}>
                    <Title className={styles["profile-settings-title"]}>
                        Settings
                    </Title>
                </header>
                <div className={styles["profile-settings-body"]}>
                    <div className={styles["profile-settings-item"]}>
                        <Paragraph>
                            Theme
                        </Paragraph>
                        <div className={styles["profile-settings-theme"]}>
                            <button 
                                className={clsx(
                                    styles["profile-settings-theme-button"], 
                                    theme === "light" && styles["active"]
                                )}
                                onClick={() => toggleTheme()}
                            >
                                <Description>
                                    Light
                                </Description>
                            </button>
                            <button 
                                className={clsx(
                                    styles["profile-settings-theme-button"], 
                                    theme === "dark" && styles["active"]
                                )}
                                onClick={() => toggleTheme()}
                            >
                                <Description>
                                    Dark
                                </Description>
                            </button>
                        </div>
                    </div>
                    <div className={styles["profile-settings-item"]}>
                        <Paragraph>
                            Update feed after every reload
                        </Paragraph>
                        <Switch 
                            active={feedSettings.updateAfterEveryReload}
                            setActive={(active: boolean) => dispatch(setUpdateAfterEveryReload(active))}
                        />
                    </div>
                    <OutlinedButton onClick={logoutHandler}>
                        <Subtitle>
                            Log Out
                        </Subtitle>
                    </OutlinedButton>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;