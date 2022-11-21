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
    friendFound,
  } = props;

  useEffect(() => {
    if (friendId) {
      const getConversation = async () => {
        const _conversation = await getFriendMessages(token, friendId);
        setConversation(_conversation.messagesBetweenUsers);
        if (!_conversation.messagesBetweenUsers.length) {
          await setFriendFound(false);
        }
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

  const handleKeyDown = (event) => {
    if (
      !text ||
      // !friendId ||
      // !friendInfo ||
      // !conversation.length ||
      !selected ||
      !friendFound
    ) {
      return;
    } else if (event.key == "Enter" && event.shiftKey == false) {
      handleSend(friendId, friendInfo);
    }
  };

  const textLength = 255 - text.length;

  return (
    <div id="message-container">
      <div className="expanded-messages">
        {selected
          ? conversation.map((singleMessage, i) => {
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
        <div id="sendmessage">
          <div id="textarea-container">
            <div id="character-length">Character Length: {textLength}</div>
            <textarea
              className="message-input"
              type="text"
              maxLength={255}
              placeholder="Enter message here"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
              }}
              onKeyDown={(event) => handleKeyDown(event)}
            />
          </div>
          <button
            disabled={
              !text ||
              !friendId ||
              !friendInfo ||
              // !conversation.length ||
              !selected ||
              !friendFound
            }
            onClick={() => handleSend(friendId, friendInfo)}
          >
            <FontAwesomeIcon icon="fa-solid fa-message" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
