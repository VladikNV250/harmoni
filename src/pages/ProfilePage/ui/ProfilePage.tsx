import { FC, useEffect } from "react";
import "./ProfilePage.scss";
import { useAppDispatch, useAppSelector } from "shared/lib";
import { getUserInfo, selectUser, selectUserError, selectUserLoading,  } from "entities/user";
import placeholderProfileImage from "shared/assets/placeholder/placeholder.jpg";
import { Description, Paragraph, Subtitle, Text, Title } from "shared/ui";
import Edit from "shared/assets/icons/edit-big.svg?react";
import Share from "shared/assets/icons/share-big.svg?react";
import Logo from "shared/assets/Spotify_Primary_Logo_RGB_Green.png";
import AddFriend from "shared/assets/icons/add-friend-big.svg?react";
import Playing from "shared/assets/icons/playing-big.svg?react";

export const ProfilePage: FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const loading = useAppSelector(selectUserLoading);
    const error = useAppSelector(selectUserError);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch])

    return (
        <div className="profile">
            {loading && "Loading..."}
            {user &&
            <div className="user-info">
                <img src={user.images[0]?.url ?? placeholderProfileImage} className="user-avatar" />
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
            {error && error.messageError}
        </div>
    )
}