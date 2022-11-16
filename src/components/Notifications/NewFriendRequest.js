import React from "react";
import { acceptFriend, denyFriend } from "../../api";

const NewFriendRequest = ({
  token,
  notification,
  notiTrigger,
  setNotiTrigger,
}) => {
  const acceptFriendButton = async () => {
    const friend = await acceptFriend(
      token,
      notification.miscId,
      notification.id
    );
    if (friend.success) {
      setNotiTrigger(!notiTrigger);
    }
  };

  const denyFriendButton = async () => {
    await denyFriend(token, notification.miscId, notification.id);
    setNotiTrigger(!notiTrigger);
  };

  const tempStyle = {
    height: "50px",
  };

  return (
    <div id="friend-request">
      {notification.text}
      <div id="notification-btns">
        <button
          id="accept-btn"
          onClick={() => {
            acceptFriendButton();
          }}
        >
          Accept
        </button>
        <button
          id="decline-btn"
          onClick={() => {
            denyFriendButton();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NewFriendRequest;
