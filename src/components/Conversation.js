import { useEffect, useState } from "react";
import { getFriendMessages, deleteMessage, sendMessage } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import timeAgo from "node-time-ago";

const Conversation = (props) => {
  const token = localStorage.getItem("token");
  const {
    friendInfo,
    friendId,
    selected,
    admin,
    myId,
    text,
    setText,
    loadingTrigger,
    setLoadingTrigger,
    conversation,
    setConversation,
    setFriendFound,
  } = props;
  //   const [conversation, setConversation] = useState([]);

  useEffect(() => {
    if (friendId) {
      const getConversation = async () => {
        const _conversation = await getFriendMessages(token, friendId);
        setConversation(_conversation.messagesBetweenUsers);
      };
      getConversation();
    }
  }, [friendId, loadingTrigger]);

  const handleSend = async (friendId, friendInfo) => {
    if (friendId && friendInfo) {
      await sendMessage(friendId, new Date(), text, token);
    } else if (friendId) {
      await sendMessage(friendId, new Date(), text, token);
    } else if (friendInfo) {
      await sendMessage(friendInfo.id, new Date(), text, token);
    }
    setText("");
    setLoadingTrigger(!loadingTrigger);
  };

  const handleDelete = async (messageId) => {
    await deleteMessage(token, messageId);
    setLoadingTrigger(!loadingTrigger);
  };

  return (
    <div id="message-container">
      <div className="expanded-messages">
        {selected
          ? conversation.map((singleMessage, i) => {
              // const findFriend = (message) => {                    IGNORE ALL THIS COMMENTED OUT CODE FOR NOW
              //   return (
              //     message.recipientUserId === friendId ||
              //     message.sendingUserId === friendId
              //   );
              // };
              // const found = conversation.find(findFriend);
              // console.log("FOUND FOUND FOUND", found);
              // setFriendFound(found);
              const date = new Date(singleMessage.time);
              const time = date.toLocaleString();
              return (
                <div
                  className={
                    singleMessage.sendingUserId === friendId
                      ? "friends-message message"
                      : "my-message message"
                  }
                >
                  <div>
                    <div className="inline-message">
                      {admin || singleMessage.sendingUserId === myId ? (
                        <span>
                          <FontAwesomeIcon
                            icon="fa-solid fa-trash"
                            onClick={() =>
                              handleDelete(singleMessage.id, friendId)
                            }
                          />
                        </span>
                      ) : null}
                      <div className="single-message-text bubble">
                        {singleMessage.text}{" "}
                      </div>
                    </div>
                    <div className="single-message-time"> {timeAgo(time)}</div>
                  </div>
                </div>
              );
            })
          : null}
        <div>
          <div id="sendmessage">
            <textarea
              className="message-input"
              type="text"
              maxLength={255}
              placeholder="Enter message here"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
              }}
            />
            <button
              disabled={!text || !friendId || !friendInfo}
              onClick={() => handleSend(friendId, friendInfo)}
            >
              <FontAwesomeIcon icon="fa-solid fa-message" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
