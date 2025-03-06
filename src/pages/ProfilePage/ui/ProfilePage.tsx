import { 
    FC, 
    useEffect 
} from "react";
import { 
    useAppDispatch, 
    useAppSelector 
} from "shared/lib";
import { 
    getUserInfo, 
    selectUser, 
    selectUserError, 
    selectUserLoading  
} from "entities/user";
import { 
    Description, 
    Loader, 
    Paragraph, 
    Subtitle, 
    Title 
} from "shared/ui";
import { 
    feedSlice, 
    selectFeedSettings 
} from "entities/feed";
import { 
    AddFriend, 
    Edit, 
    Logo, 
    PlaceholderProfileImage, 
    Share 
} from "shared/assets";
import styles from "./style.module.scss";

const ProfilePage: FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectUserLoading);
    const error = useAppSelector(selectUserError);
    const feedSettings = useAppSelector(selectFeedSettings);
    const { setUpdateAfterEveryReload } = feedSlice.actions;

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch])

    return (
        <div className={styles["profile"]}>
            <Loader loading={loading} />
            {user &&
            <div className={styles["user-info"]}>
                <img 
                    src={user.images[0]?.url ?? PlaceholderProfileImage} 
                    className={styles["user-avatar"]} 
                />
                <div className={styles["user-content"]}>
                    <div className={styles["user-header"]}>
                        <Title className={styles["user-name"]}>
                            {user.display_name ?? ""}
                        </Title>
                        <button className={styles["user-button"]}>
                            <Edit width={40} height={40} className={styles["user-icon"]} />
                        </button>
                        <button className={styles["user-button"]}>
                            <Share width={40} height={40} className={styles["user-icon"]} />
                        </button>
                    </div>
                    <div className={styles["user-body"]}>
                        {user.followers?.total > 0 &&
                        <>
                            <p className={styles["user-text"]}>
                                <Description className={styles["white"]}>
                                    {`${user.followers.total}`}
                                </Description>
                                <Description>followers</Description>
                            </p>
                            <p className={styles["user-text"]}>&#x2022;</p>
                        </>
                        
                        }
                        <p className={styles["user-text"]}>
                            <Description className={styles["white"]}>
                                30
                            </Description>
                            <Description>following</Description>
                        </p>
                    </div>
                    <Description className={styles["user-id"]}>
                        {user.id}
                    </Description>
                </div>
            </div>}
            {user && 
            <div className={styles["plan-info"]}>
                <div className={styles["plan-header"]}>
                    <img src={Logo} className={styles["plan-logo"]} />
                    <p className={styles["plan-title"]}>Current Plan</p>
                </div>
                <Subtitle className={styles["plan-status"]}>
                    {user.product === "premium" ? "Premium - Individual" : "Free"}
                </Subtitle>
                <Description className={styles["plan-price"]}>
                    {user.product === "premium" ? "$10.99 / month" : "$0.0 / month"}
                </Description>
            </div>}
            <div className={`${styles["friends-info"]} ${styles["friends"]}`}>
                <div className={styles["friends-header"]}>
                    <p className={styles["friends-title"]}>
                        Friends
                    </p>
                    <button className={styles["friends-button"]}>
                        <AddFriend width={40} height={40} className={styles["friends-icon"]} />
                    </button>
                </div>
                <Paragraph className={styles["friends-empty"]}>
                    You haven’t added any friends.
                </Paragraph>
                {/* <div className="friends-content">
                    <div className="friend-container friend">
                        <img src={placeholderProfileImage} className="friend-avatar" />
                        <div className="friend-body">
                            <Text className="friend-name">FriendlyMusicListener</Text>
                            <div className="friend-content">
                                <Playing width={30} height={30} className="friend-icon" />
                                <div className="song-container">
                                    <Description className="song-name">Get Lucky</Description>
                                    <p className="song-dot">&#x2022;</p>
                                    <Description className="song-artist">Daft Punk</Description>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
            <button 
                className={styles["button"]} 
                onClick={() => localStorage.clear()}
            >
                Clear Local Storage
            </button>
            <button 
                className={styles["button"]} 
                onClick={() => 
                    dispatch(setUpdateAfterEveryReload(!feedSettings.updateAfterEveryReload)
                )}
            >
                Update After Every Reload {`${feedSettings.updateAfterEveryReload}`}
            </button>
            {error && error.messageError}
        </div>
    )
}

export default ProfilePage;