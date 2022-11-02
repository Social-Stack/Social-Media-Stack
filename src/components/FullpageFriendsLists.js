import { useEffect, useState } from "react";
import { getMyFriends, getMyUserInfo } from "../api";
import "../stylesheets/FullpageFriendsLists.css";

const FullpageFriendsLists = (props) => {
  const [friends, setFriends] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getAllFriends = async () => {
      const { id } = await getMyUserInfo(token);
      const myFriends = await getMyFriends(token, id);
      setFriends(myFriends.friendsLists);
    };
    getAllFriends();
  }, []);

  return (
    <div>
      <h1 id="friendslists-page-title">My Friends</h1>
      <div id="friends-container">
        {friends.map((friend, i) => {
          return (
            <div id="friend-list" key={i}>
              <a href="#">
                <img id="friend-img" height="80px" src={friend.picUrl} />
              </a>
              <h3 id="friend-name">
                <a href="#">
                  {friend.firstname} {friend.lastname}
                </a>
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FullpageFriendsLists;
