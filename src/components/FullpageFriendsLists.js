import { useEffect, useState } from "react";
import { getMyFriends, getMyUserInfo } from "../api";

const FullpageFriendsLists = (props) => {
  const [friends, setFriends] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getAllFriends = async () => {
      const { id } = await getMyUserInfo(token);
      console.log("id", id);
      const myFriends = await getMyFriends(token, id);
      setFriends(myFriends.friendsLists);
      console.log("friends", myFriends);
    };
    getAllFriends();
  }, []);

  return (
    <div>
      <h1>My Friends</h1>
      <div>
        {friends.map((friend) => {
          return (
            <div>
              <h3>
                <a href="#">
                  <img src={friend.picUrl} />
                </a>
                <a href="#">
                  {friend.firstname} {friend.lastname}
                </a>
              </h3>
              <h3></h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FullpageFriendsLists;
