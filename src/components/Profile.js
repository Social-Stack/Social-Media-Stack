import { useEffect, useState } from 'react';
import { getFriendStatus, getProfileData } from '../api';
import SinglePost from './SinglePost';
import NewPost from './NewPost';
import { Link, useParams } from 'react-router-dom';
import '../stylesheets/Profile.css';
import ProfileFriendButton from './ProfileFriendButton';
import ProfileMessage from './ProfileMessage';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [loadingTrigger, setLoadingTrigger] = useState(true);
  const [profileReloadTrigger, setProfileReloadTrigger] = useState(false);
  const [reloadPostTrigger, setReloadPostTrigger] = useState(false);
  const [friendStatus, setFriendStatus] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [width, setWidth] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const token = localStorage.getItem('token');

  const { username } = useParams();

  useEffect(() => {
    setCurrentUsername(localStorage.getItem('username'));
    setWidth('profile-NewPostBox');
    setSendingMessage(false);
    if (token) {
      getUserInfo();
    }
  }, [loadingTrigger, username, profileReloadTrigger, token]);

  const getUserInfo = async () => {
    const userProfile = await getProfileData(token, username);
    setUserInfo(userProfile.user);
    setUserPosts(userProfile.posts);
    setUserFriends(userProfile.friendList);
    setReloadPostTrigger(!reloadPostTrigger);
    const { status } = await getFriendStatus(token, username);
    setFriendStatus(status);
  };

  return (
    <div id='profile-container'>
      <div id='userinfo-container'>
        <div id='profile-info'>
          <img id='user-image' height='150px' src={userInfo.picUrl} />
          <div id='user'>
            <h1 id='user-fullname'>
              {userInfo.firstname} {userInfo.lastname}
            </h1>
            <p id='friend-num'>{String(userFriends.length)} friends</p>
            <ProfileFriendButton
              token={token}
              status={friendStatus}
              username={username}
              profileReloadTrigger={profileReloadTrigger}
              setProfileReloadTrigger={setProfileReloadTrigger}
            />
          </div>
        </div>
        <div id='profile-btns'>
          <Link id='link-friends' to={`/friendslists/${userInfo.username}`}>
            <button id='friends-btn'>friends</button>
          </Link>
          {userInfo.username && userInfo.username !== currentUsername ? (
            sendingMessage ? (
              <ProfileMessage
                userInfo={userInfo}
                token={token}
                setSendingMessage={setSendingMessage}
              />
            ) : (
              <button
                id='message-btn'
                onClick={() => {
                  setSendingMessage(true);
                }}
              >
                Send Message
              </button>
            )
          ) : null}
        </div>
      </div>
      <div id='profile-main-wrapper'>
        {userFriends.length === 1 ? (
          <div id='friends-profile-container-single'>
            <h2 id='friends-profile-title'>Friends</h2>
            <div id='test-123'>
              {userFriends.map((friend, i) => {
                return (
                  <div key={i} id='friend-wrapper-single'>
                    <Link to={`/profile/${friend.username}`}>
                      <img height='80px' src={friend.picUrl} />
                    </Link>
                    <h3>
                      {friend.firstname} {friend.lastname}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div id='friends-profile-container'>
            <h2 id='friends-profile-title'>Friends</h2>
            <div id='test-123'>
              {userFriends.map((friend, i) => {
                return (
                  <div key={i} id='friend-wrapper'>
                    <Link to={`/profile/${friend.username}`}>
                      <img height='80px' src={friend.picUrl} />
                    </Link>
                    <h3>
                      {friend.firstname} {friend.lastname}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div id='wrapper-posts'>
          <div id='profile-newPostBox-container'>
            <NewPost
              token={token}
              loadingTrigger={loadingTrigger}
              setLoadingTrigger={setLoadingTrigger}
              width={width}
            />
          </div>
          <div id='profile-posts-container'>
            {userPosts[0] &&
              userPosts.map((post, i) => {
                return (
                  <SinglePost
                    key={i}
                    post={post}
                    token={token}
                    reloadPostTrigger={reloadPostTrigger}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
