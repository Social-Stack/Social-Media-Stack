import { useEffect, useState } from "react";
import { getAllMyMessages, getMyUserInfo, getFriendMessages } from "../api";
import Conversation from "./Conversation";
import "../stylesheets/Messages.css";

const Messages = (props) => {
  // const { token } = props;
  const token = localStorage.getItem("token");
  const [allMessages, setAllMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const getChatlist = async () => {
      const { id } = await getMyUserInfo(token);
      const myMessages = await getAllMyMessages(token, id);
      setAllMessages(myMessages.allMyMessages);
    };
    getChatlist();
  }, []);

  const result = allMessages.reduce((groupedMessages, message) => {
    const sendingUserId = message.sendingUserId;
    if (groupedMessages[sendingUserId] == null)
      groupedMessages[sendingUserId] = [];
    groupedMessages[sendingUserId].push(message);
    return groupedMessages;
  }, []);

  console.log("REDUCED RESULT", result);

  const handleClick = async (friendUserId, i) => {
    const _conversation = await getFriendMessages(token, friendUserId);
    setConversation(_conversation.messagesBetweenUsers);
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
  };

  return (
    <div>
      <h1 id="messages-heading">Messages</h1>

      <div>
        {result.map((groupedMessages, i) => {
          return (
            <>
              <div>Message from: {groupedMessages[0].sendingusername}</div>
              {groupedMessages.map((singleMessage) => {
                return (
                  <div className="single-message">
                    <div className="single-message-text">
                      {singleMessage.text}
                    </div>
                    <div className="single-message-time">
                      {singleMessage.time}
                    </div>
                    <br />
                  </div>
                );
              })}
            </>
          );
        })}
      </div>

      <div>
        {result.map((groupedMessage, i) => {
          const date = new Date(groupedMessage[0].time);
          const time = date.toLocaleString();
          const friendUserId = groupedMessage[0].sendingUserId;
          return (
            <div className="single-message">
              <div className="single-message-sender">
                {" "}
                Conversation with {groupedMessage[0].sendingfirstname}
              </div>
              <button onClick={() => handleClick(friendUserId, i)}>
                {selected === i ? (
                  <span>Collapse Conversation</span>
                ) : (
                  <span>View Conversation</span>
                )}
              </button>
              <div className="expanded-messages">
                {selected
                  ? conversation.map((singleMessage) => {
                      return (
                        <div
                          className={
                            selected === i
                              ? "single-message-expanded"
                              : "single-message-collapsed"
                          }
                        >
                          <div className="single-message-text">
                            {singleMessage.text}
                          </div>
                          <div className="single-message-time"> {time}</div>
                          <br />
                        </div>
                      );
                    })
                  : null}
                {/* {selected ? <div> Selected </div> : <div> Not Selected </div>} */}
              </div>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
