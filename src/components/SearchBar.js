import { useState, useEffect } from "react";
import { getMyFriends, getAFriend, getFriendMessages } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../stylesheets/SearchBar.css";

const SearchBar = (props) => {
  const token = localStorage.getItem("token");
  const {
    myId,
    setFriendInfo,
    setConversation,
    setSelected,
    setFriendId,
    setFriendFound,
    friendFound,
    selected,
  } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (myId) {
      const getFriendsList = async () => {
        const friendsList = await getMyFriends(token, myId);
        setFriends(friendsList.friendsLists);
      };
      getFriendsList();
    }
  }, [searchTerm]);

  const handleClick = async (friendUserId) => {
    setFriendId(friendUserId);
    const _friend = await getAFriend(token, friendUserId);
    setFriendInfo(_friend);
    const _conversation = await getFriendMessages(token, friendUserId);
    setConversation(_conversation.messagesBetweenUsers);
    setSelected(friendUserId);
    setFriendFound(true);
    setSearchTerm("");
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search for a friend! "
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      ></input>
      <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
      <div className="search-results">
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
              <option
                id="searched-friend"
                onClick={() => handleClick(friendUserId)}
              >
                {friend.firstname} {friend.lastname}
              </option>
            );
          })}
      </div>
    </div>
  );
};

export default SearchBar;
