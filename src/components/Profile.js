import { useEffect, useState } from "react";
import { getProfileData } from "../api";
import SinglePost from "./SinglePost";
import NewPost from "./NewPost";
import { Link, useParams } from "react-router-dom";
import "../stylesheets/Profile.css";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [loadingTrigger, setLoadingTrigger] = useState(true);
  const token = localStorage.getItem("token");

  const { username } = useParams();
  useEffect(() => {
    const getUserInfo = async () => {
      const userProfile = await getProfileData(token, username);
      setUserInfo(userProfile.user);
      setUserPosts(userProfile.posts);
      setUserFriends(userProfile.friendList);
    };
    getUserInfo();
  }, [loadingTrigger]);

  return (
    <div id="profile-container">
      <div id="userinfo-container">
        <img id="user-image" height="150px" src={userInfo.picUrl} />
        <h1 id="user-fullname">
          {userInfo.firstname} {userInfo.lastname}
        </h1>
        <p>{String(userFriends.length)} friends</p>
        <Link to={`/friendslists/${userInfo.username}`}>
          <button id="friends-btn">friends</button>
        </Link>
      </div>
      <div id="profile-main-wrapper">
        <div id="friends-profile-container">
          {userFriends.map((friend, i) => {
            return (
              <div key={i} id="friend-wrapper">
                <img height="80px" src={friend.picUrl} />
                <h3>
                  {friend.firstname} {friend.lastname}
                </h3>
              </div>
            );
          })}
        </div>
        <div id="wrapper-posts">
          <NewPost
            token={token}
            loadingTrigger={loadingTrigger}
            setLoadingTrigger={setLoadingTrigger}
          />
          <div id="profile-posts-container">
            {userPosts[0] &&
              userPosts.map((post, i) => {
                return <SinglePost key={i} post={post} token={token} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
