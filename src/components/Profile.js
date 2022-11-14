import { useEffect, useState } from "react";
import { getFriendStatus, getProfileData } from "../api";
import SinglePost from "./SinglePost";
import NewPost from "./NewPost";
import { Link, useParams } from "react-router-dom";
import "../stylesheets/Profile.css";
import ProfileFriendButton from "./ProfileFriendButton";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [loadingTrigger, setLoadingTrigger] = useState(true);
  const [profileReloadTrigger, setProfileReloadTrigger] = useState(false);
  const [reloadPostTrigger, setReloadPostTrigger] = useState(false);
  const [friendStatus, setFriendStatus] = useState('');
  const token = localStorage.getItem("token");

  const { username } = useParams();
  useEffect(() => {
    const getUserInfo = async () => {
      const userProfile = await getProfileData(token, username);
      setUserInfo(userProfile.user);
      setUserPosts(userProfile.posts);
      setUserFriends(userProfile.friendList);
      setReloadPostTrigger(!reloadPostTrigger);
      const {status} = await getFriendStatus(token, username);
      setFriendStatus(status);
    };
    getUserInfo();
  }, [loadingTrigger, username, profileReloadTrigger]);

  return (
    <div id="profile-container">
      <div id="userinfo-container">
        <div id="profile-info">
          <img id="user-image" height="150px" src={userInfo.picUrl} />
          <div id="user">
            <h1 id="user-fullname">
              {userInfo.firstname} {userInfo.lastname}
            </h1>
            <p id="friend-num">{String(userFriends.length)} friends</p>
            <ProfileFriendButton
              token={token}
              status={friendStatus}
              username={username}
              profileReloadTrigger={profileReloadTrigger}
              setProfileReloadTrigger={setProfileReloadTrigger}/>
          </div>
        </div>
        <Link id="link-friends" to={`/friendslists/${userInfo.username}`}>
          <button id="friends-btn">friends</button>
        </Link>
      </div>
      <div id="profile-main-wrapper">
        {userFriends.length === 1 ? (
          <div id="friends-profile-container-single">
            <h3 id="friends-profile-title">Friends</h3>
            {userFriends.map((friend, i) => {
              return (
                <div key={i} id="friend-wrapper-single">
                  <Link to={`/profile/${friend.username}`}>
                    <img height="80px" src={friend.picUrl} />
                  </Link>
                  <h3>
                    {friend.firstname} {friend.lastname}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : (
          <div id="friends-profile-container">
            <h3 id="friends-profile-title">Friends</h3>
            {userFriends.map((friend, i) => {
              return (
                <div key={i} id="friend-wrapper">
                  <Link to={`/profile/${friend.username}`}>
                    <img height="80px" src={friend.picUrl} />
                  </Link>
                  <h3>
                    {friend.firstname} {friend.lastname}
                  </h3>
                </div>
              );
            })}
          </div>
        )}
        <div id="wrapper-posts">
          <NewPost
            token={token}
            loadingTrigger={loadingTrigger}
            setLoadingTrigger={setLoadingTrigger}
          />
          <div id="profile-posts-container">
            {userPosts[0] &&
              userPosts.map((post, i) => {
                return <SinglePost key={i} post={post} token={token} reloadPostTrigger={reloadPostTrigger}/>;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
