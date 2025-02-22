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
import "./ProfilePage.scss";
import { AddFriend, Edit, Logo, PlaceholderProfileImage, Share } from "shared/assets";

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
        <div className="profile">
            <Loader loading={loading} />
            {user &&
            <div className="user-info">
                <img src={user.images[0]?.url ?? PlaceholderProfileImage} className="user-avatar" />
                <div className="user-content">
                    <div className="user-header">
                        <Title className="user-name">{user.display_name ?? ""}</Title>
                        <button className="user-button">
                            <Edit width={40} height={40} className="user-icon" />
                        </button>
                        <button className="user-button">
                            <Share width={40} height={40} className="user-icon" />
                        </button>
                    </div>
                    <div className="user-body">
                        {user.followers?.total > 0 &&
                        <>
                            <p className="user-text">
                                <Description className="white">{`${user.followers.total}`}</Description>
                                <Description>followers</Description>
                            </p>
                            <p className="user-text">&#x2022;</p>
                        </>
                        
                        }
                        <p className="user-text">
                            <Description className="white">30</Description>
                            <Description>following</Description>
                        </p>
                    </div>
                    <Description className="user-id">{user.id}</Description>
                </div>
            </div>}
            {user && 
            <div className="plan-info">
                <div className="plan-header">
                    <img src={Logo} className="plan-logo" />
                    <p className="plan-title">Current Plan</p>
                </div>
                <Subtitle className="plan-status">
                    {user.product === "premium" ? "Premium - Individual"
                    : "Free"}
                </Subtitle>
                <Description className="plan-price">
                    {user.product === "premium" ? "$10.99 / month"
                    : "$0.0 / month"}
                </Description>
            </div>}
            <div className="friends-info friends">
                <div className="friends-header">
                    <p className="friends-title">
                        Friends
                    </p>
                    <button className="friends-button">
                        <AddFriend width={40} height={40} className="friends-icon" />
                    </button>
                </div>
                <Paragraph className="friends-empty">You haven’t added any friends.</Paragraph>
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
            <button className="button" onClick={() => localStorage.clear()}>
                Clear Local Storage
            </button>
            <button 
                className="button" 
                onClick={() => dispatch(setUpdateAfterEveryReload(!feedSettings.updateAfterEveryReload))}>
                Update After Every Reload {`${feedSettings.updateAfterEveryReload}`}
            </button>
            {error && error.messageError}
        </div>
    )
}

export default ProfilePage;