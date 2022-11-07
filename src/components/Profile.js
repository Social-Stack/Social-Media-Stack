import { useEffect, useState } from "react";
import { getMyUserInfo, getPostsByUserId } from "../api";

const Profile = (props) => {
  const [userInfo, setUserInfo] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const getUserInfo = async () => {
      const info = await getMyUserInfo(token);
      const { id } = await getMyUserInfo(token);
      const posts = await getPostsByUserId(token, id);
      console.log("posts", posts);
      setUserInfo(info);
      setUserPosts(posts);
    };
    getUserInfo();
  }, []);
  return (
    <div>
      <img id="user-image" height="150px" src={userInfo.picUrl} />
      <h1>
        {userInfo.firstname} {userInfo.lastname}
      </h1>
      {userPosts[0] &&
        userPosts.map((post, i) => {
          return (
            <div>
              <h4>{post.text}</h4>
            </div>
          );
        })}
    </div>
  );
};

export default Profile;
