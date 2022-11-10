import { useEffect, useState } from "react";
import { getMyFriends, getProfileData } from "../api";
import { Link, useParams } from "react-router-dom";
import "../stylesheets/FullpageFriendsLists.css";

const FullpageFriendsLists = () => {
  const [friends, setFriends] = useState([]);

  const token = localStorage.getItem("token");

  const { username } = useParams();
  useEffect(() => {
    const getAllFriends = async () => {
      const myInfo = await getProfileData(token, username);
      const myFriends = await getMyFriends(token, myInfo.user.id);
      setFriends(myFriends.friendsLists);
    };
    getAllFriends();
  }, []);

  return (
    <div>
      <h1 id="friendslists-page-title">My Friends</h1>
      <div id="friends-container">
        {friends[0] &&
          friends.map((friend, i) => {
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
