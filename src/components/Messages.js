import { useEffect, useState } from "react";
import {
  getAllMyMessages,
  getMyUserInfo,
  getFriendMessages,
  sendMessage,
  deleteMessage,
} from "../api";
import Conversation from "./Conversation";
import "../stylesheets/Messages.css";

const Messages = (props) => {
  // const { token } = props;
  const token = localStorage.getItem("token");
  const [allMessages, setAllMessages] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [selected, setSelected] = useState(null);
  // const [loadingTrigger, setLoadingTrigger] = useState(true);
  const [text, setText] = useState("");

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

  const handleClick = async (friendUserId, i) => {
    const _conversation = await getFriendMessages(token, friendUserId);
    setConversation(_conversation.messagesBetweenUsers);
    if (selected === i) {
      return setSelected(null);
    }
    setSelected(i);
    // setLoadingTrigger(!loadingTrigger);
  };

  const handleSend = async (friendUserId) => {
    console.log("friendUserId", friendUserId);
    const sent = await sendMessage(friendUserId, new Date(), text, token);
    console.log("SENT MESSAGE", sent);
    // setLoadingTrigger(!loadingTrigger);
    // setConversation((prev) => [...prev, sent.newMessage]);
    const _conversation = await getFriendMessages(token, friendUserId);
    setConversation(_conversation.messagesBetweenUsers);
    setText("");
  };

  const handleDelete = async (messageId, friendUserId) => {
    console.log("MESSAGE ID", messageId);
    const deletedMessage = await deleteMessage(token, messageId);
    console.log("DELETED MESSAGE", deletedMessage);
    const _conversation = await getFriendMessages(token, friendUserId);
    setConversation(_conversation.messagesBetweenUsers);
  };

  return (
    <div>
      <h1 id="messages-heading">Messages</h1>
      {/* 
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
      </div> */}

      <div>
        {result.map((groupedMessage, i) => {
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
                      const date = new Date(singleMessage.time);
                      const time = date.toLocaleString();
                      return (
                        <>
                          <div
                            className={
                              selected === i
                                ? "single-message-expanded"
                                : "single-message-collapsed"
                            }
                          >
                            <div className="single-message-sender">
                              From: {singleMessage.sendingfirstname}
                            </div>
                            <div className="single-message-text">
                              {singleMessage.text}{" "}
                              {/* <span
                                onClick={() => handleDelete(singleMessage.id)}
                              >
                                x
                              </span> */}
                              <button
                                onClick={() =>
                                  handleDelete(singleMessage.id, friendUserId)
                                }
                              >
                                x
                              </button>
                            </div>
                            <div className="single-message-time"> {time}</div>
                            <br />
                          </div>
                        </>
                      );
                    })
                  : null}
                <div
                  className={
                    selected === i
                      ? "single-message-expanded"
                      : "single-message-collapsed"
                  }
                >
                  <textarea
                    type="text"
                    placeholder="Enter message here"
                    value={text}
                    onChange={(event) => {
                      setText(event.target.value);
                    }}
                  ></textarea>
                  <div>
                    <button
                      disabled={!text}
                      onClick={() => handleSend(friendUserId)}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
              <br />
              {/* <textarea className="message-input" type="text"></textarea> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
