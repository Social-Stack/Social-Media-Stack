import { useState, useEffect } from "react";
import { getMyFriends, getAFriend } from "../api";

const SearchBar = (props) => {
  const token = localStorage.getItem("token");
  const { myId, setFriendInfo } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (myId) {
      const getFriendsList = async () => {
        // console.log("MYID", userId);
        const friendsList = await getMyFriends(token, myId);
        setFriends(friendsList.friendsLists);
        console.log("FRIENDS LIST", friendsList.friendsLists);
      };
      getFriendsList();
    }
  }, [searchTerm]);

  const handleClick = async (friendUserId) => {
    const _friend = await getAFriend(token, friendUserId);
    setFriendInfo(_friend);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a friend!"
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      ></input>
      <div>
        {friends
          .filter((friend) => {
            if (searchTerm == "") {
              return "";
            } else if (
              friend.firstname.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return friend;
            } else if (
              friend.lastname.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return friend;
            }
          })
          .map((friend) => {
            const friendUserId = friend.friendId;
            return (
              <option onClick={() => handleClick(friendUserId)}>
                {friend.firstname} {friend.lastname}
              </option>
            );
          })}
      </div>
    </div>
  );
};

export default SearchBar;
