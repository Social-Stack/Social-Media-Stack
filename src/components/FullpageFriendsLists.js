import { useEffect, useState } from "react";
import { getMyFriends, getMyUserInfo } from "../api";
import { Link } from "react-router-dom";
import "../stylesheets/FullpageFriendsLists.css";
import { Profile } from ".";

const FullpageFriendsLists = (props) => {
  const [friends, setFriends] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getAllFriends = async () => {
      const { id } = await getMyUserInfo(token);
      const myFriends = await getMyFriends(token, id);
      console.log(myFriends);
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
              <Link to={`/profile/${friend.username}`}>
                <img id="friend-img" height="80px" src={friend.picUrl} />
              </Link>
              <h3 id="friend-name">
                <Link to={`/profile/${friend.username}`}>
                  {friend.firstname} {friend.lastname}
                </Link>
              </h3>
              <button
                onClick={() => {
                  console.log(friend);
                }}
              >
                Helper
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FullpageFriendsLists;
