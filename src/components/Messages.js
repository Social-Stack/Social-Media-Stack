import { useEffect, useState } from "react";
import { getAllMyMessages, getMyUserInfo, getAFriend } from "../api";
import Conversation from "./Conversation";
import "../stylesheets/Messages.css";
import timeAgo from "node-time-ago";
import SearchBar from "./SearchBar";

const Messages = () => {
  const token = localStorage.getItem("token");
  const [allMessages, setAllMessages] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [myId, setMyId] = useState("");
  const [conversation, setConversation] = useState([]);
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const [friendId, setFriendId] = useState("");
  const [friendInfo, setFriendInfo] = useState({});
  const [loadingTrigger, setLoadingTrigger] = useState(true);
  const [friendFound, setFriendFound] = useState(true);

  useEffect(() => {
    const getChatlist = async () => {
      const { id, isAdmin } = await getMyUserInfo(token);
      setMyId(id);
      setAdmin(isAdmin);
      const myMessages = await getAllMyMessages(token, id);
      setAllMessages(myMessages.allMyMessages);
    };

    getChatlist();
  }, [loadingTrigger]);

  const result = allMessages.reduce((groupedMessages, message) => {
    const sendingUserId = message.sendingUserId;
    const recipientUserId = message.recipientUserId;

    if (message.sendingUserId == myId) {
      if (groupedMessages[recipientUserId] == null)
        groupedMessages[recipientUserId] = [];
      groupedMessages[recipientUserId].push(message);
    } else {
      if (groupedMessages[sendingUserId] == null)
        groupedMessages[sendingUserId] = [];
      groupedMessages[sendingUserId].push(message);
    }
    return groupedMessages;
  }, []);

  const handleClick = async (friendUserId, i) => {
    setFriendId(friendUserId);
    const friend = await getAFriend(token, friendUserId);
    setFriendInfo(friend);
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
    setText("");
  };

  return (
    <div id="chat-container">
      <div id="outer">
        <div id="chatbox">
          <h1 id="messages-heading">Chats</h1>
          <div id="search">
            <SearchBar
              myId={myId}
              setFriendInfo={setFriendInfo}
              setConversation={setConversation}
              conversation={conversation}
              setSelected={setSelected}
              setFriendId={setFriendId}
              loadingTrigger={loadingTrigger}
              setLoadingTrigger={setLoadingTrigger}
              setFriendFound={setFriendFound}
              friendFound={friendFound}
              selected={selected}
            />
          </div>
          {!result.length && friendInfo ? ( //switch if needed
            <h2>Search for a friend and start chatting!</h2>
          ) : (
            result.map((groupedMessage, i) => {
              let friendUserId;
              {
                groupedMessage[0].sendingUserId === myId
                  ? (friendUserId = groupedMessage[0].recipientUserId)
                  : (friendUserId = groupedMessage[0].sendingUserId);
              }
              return (
                <div className="single-message">
                  <div
                    className="friend"
                    onClick={() => handleClick(friendUserId, i)}
                  >
                    <img src={groupedMessage[0].sendingprofilepic} />

                    <p>
                      <strong className="single-message-sender">
                        {groupedMessage[0].sendingfirstname}{" "}
                        {groupedMessage[0].sendinglastname}{" "}
                      </strong>
                    </p>
                    <p id="recent-message">
                      {groupedMessage[groupedMessage.length - 1].text
                        .slice(0, 12)
                        .concat("...")}{" "}
                      {timeAgo(groupedMessage[groupedMessage.length - 1].time)}
                    </p>
                    <div
                      className={
                        friendUserId % 2 == 0
                          ? "status available"
                          : "status away"
                      }
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <>
          {!result.length && !selected ? (
            <h2 id="no-message">You have no messages</h2>
          ) : (
            <div id="message-body">
              <div id="friend-header">
                {(selected && conversation.length) || friendFound ? (
                  <>
                    <img className="friend" src={friendInfo.picUrl} />
                    <strong>
                      <span>{friendInfo.firstname} </span>
                      <span>{friendInfo.lastname}</span>
                    </strong>
                  </>
                ) : null}
              </div>
              <div id="message-container">
                <Conversation
                  friendInfo={friendInfo}
                  friendId={friendId}
                  selected={selected}
                  admin={admin}
                  myId={myId}
                  text={text}
                  setText={setText}
                  loadingTrigger={loadingTrigger}
                  setLoadingTrigger={setLoadingTrigger}
                  conversation={conversation}
                  setConversation={setConversation}
                  friendFound={friendFound}
                  setFriendFound={setFriendFound}
                />
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Messages;
