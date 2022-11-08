import { useEffect, useState } from "react";
import {
  getMyFriends,
  getMyUserInfo,
  getPostsByUserId,
  getProfileData,
} from "../api";
import SinglePost from "./SinglePost";
import NewPost from "./NewPost";
import { Link, useParams } from "react-router-dom";

const Profile = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [loadingTrigger, setLoadingTrigger] = useState(true);
  const token = localStorage.getItem("token");

  const { username } = useParams();
  useEffect(() => {
    const getUserInfo = async () => {
      //   const info = await getMyUserInfo(token);
      //   const { id } = await getMyUserInfo(token);
      //   const posts = await getPostsByUserId(token, id);
      //   const friends = await getMyFriends(token, id);
      const userProfile = await getProfileData(token, username);
      //   setUserInfo(info);
      //   setUserPosts(posts);
      //   setUserFriends(friends.friendsLists);
      setUserInfo(userProfile.user);
      setUserPosts(userProfile.posts);
      setUserFriends(userProfile.friendList);
    };
    getUserInfo();
  }, []);

  const onClick = async () => {
    console.log(await getProfileData(token, username));
  };
  return (
    <div id="profile-container">
      <div id="userinfo-container">
        <img id="user-image" height="150px" src={userInfo.picUrl} />
        <h1>
          {userInfo.firstname} {userInfo.lastname}
        </h1>
        <p>{String(userFriends.length)} friends</p>
        <Link to="/friendslists">
          <button>friends</button>
        </Link>
        <button onClick={onClick}>Helper</button>
      </div>
      <div id="friends-container">
        {userFriends.map((friend, i) => {
          return (
            <div>
              <img height="80px" src={friend.picUrl} />
              <h3>
                {friend.firstname} {friend.lastname}
              </h3>
            </div>
          );
        })}
      </div>
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
  );
};

export default Profile;
