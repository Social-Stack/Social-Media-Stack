import React from "react";
import NewFriendRequest from "./NewFriendRequest";

const NotificationItemHandler = ({
  token,
  notification,
  setNotiTrigger,
  notiTrigger,
}) => {
  return (
    <div id="notification-items">
      {notification.type === "friendRequest" ? (
        <NewFriendRequest
          notiTrigger={notiTrigger}
          setNotiTrigger={setNotiTrigger}
          notification={notification}
          token={token}
        />
      ) : null}
    </div>
  );
};

export default NotificationItemHandler;
