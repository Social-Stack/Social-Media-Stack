import { useEffect, useState } from "react";
import { getMyFriends, getMyUserInfo, getPostsByUserId } from "../api";
import timeAgo from "node-time-ago";
import SinglePost from "./SinglePost";

const Profile = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getUserInfo = async () => {
      const info = await getMyUserInfo(token);
      const { id } = await getMyUserInfo(token);
      const posts = await getPostsByUserId(token, id);
      const friends = await getMyFriends(token, id);
      console.log("posts", posts);
      setUserInfo(info);
      setUserPosts(posts);
      setUserFriends(friends.friendsLists);
    };
    getUserInfo();
  }, []);
  return (
    <div>
      <img id="user-image" height="150px" src={userInfo.picUrl} />
      <h1>
        {userInfo.firstname} {userInfo.lastname}
      </h1>
      <p>{String(userFriends.length)} friends</p>
      {/* {userPosts[0] &&
        userPosts.map((post, i) => {
          return (
            <div>
              <img height="80px" src={post.profilePic} />
              <h3>
                {userInfo.firstname} {userInfo.lastname} {timeAgo(post.time)}
              </h3>
              <p>{post.text}</p>
            </div>
          );
        })} */}
      <SinglePost />
    </div>
  );
};

export default Profile;
