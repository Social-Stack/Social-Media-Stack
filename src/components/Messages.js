import { useEffect, useState } from "react";
import { getAllMyMessages, getMyUserInfo, getAFriend } from "../api";
import Conversation from "./Conversation";
import "../stylesheets/Messages.css";
import timeAgo from "node-time-ago";

const Messages = () => {
  const token = localStorage.getItem("token");
  const [allMessages, setAllMessages] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [myId, setMyId] = useState("");
  // const [conversation, setConversation] = useState([]);
  const [selected, setSelected] = useState(null);
  const [text, setText] = useState("");
  const [friendId, setFriendId] = useState("");
  const [friendInfo, setFriendInfo] = useState({});
  const [loadingTrigger, setLoadingTrigger] = useState(true);

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
    if (groupedMessages[sendingUserId] == null)
      groupedMessages[sendingUserId] = [];
    groupedMessages[sendingUserId].push(message);
    return groupedMessages;
  }, []);

  const handleClick = async (friendUserId, i) => {
    setFriendId(friendUserId);
    const friend = await getAFriend(token, friendUserId);
    setFriendInfo(friend);
    console.log("FRIEND", friend);
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
          <br />
          <div>search bar here</div>
          <br />
          {!result.length ? (
            <h2>Search for a friend and start chatting!</h2>
          ) : (
            result.map((groupedMessage, i) => {
              const friendUserId = groupedMessage[0].sendingUserId;
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
                      {groupedMessage[groupedMessage.length - 1].text}{" "}
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
          {!result.length ? (
            <h2 id="no-message">You have no messages</h2>
          ) : (
            <>
              <div id="friend-header">
                <img className="friend" src={friendInfo.picUrl} />
                <span>{friendInfo.firstname}</span>{" "}
                <span>{friendInfo.lastname}</span>
              </div>
              <div id="message-container">
                <div id="friend-header"></div>
                <Conversation
                  friendId={friendId}
                  selected={selected}
                  admin={admin}
                  myId={myId}
                  text={text}
                  setText={setText}
                  loadingTrigger={loadingTrigger}
                  setLoadingTrigger={setLoadingTrigger}
                />
              </div>
            </>
          )}
        </>
        {/* <div id="message-container">
          {!result.length ? (
            <h2 id="no-message">You have no messages</h2>
          ) : (
            <>
              <div id="friend-header"></div>
              <Conversation
                friendId={friendId}
                selected={selected}
                admin={admin}
                myId={myId}
                text={text}
                setText={setText}
                loadingTrigger={loadingTrigger}
                setLoadingTrigger={setLoadingTrigger}
              />
            </>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Messages;
