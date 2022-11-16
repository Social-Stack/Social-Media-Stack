import React, { useEffect, useState } from "react";
import { getAllMyNotifications, seeMyNotifications } from "../../api";
import NotificationItemHandler from "./NotificationItemHandler";
import "../../stylesheets/NotificationPage.css";

const NotificationPage = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [notiTrigger, setNotiTrigger] = useState(false);

  const fetchNotifications = async () => {
    const notis = await getAllMyNotifications(token);
    setNotifications(notis);
  };

  const seeAllNotis = async () => {
    await seeMyNotifications(token);
  };

  useEffect(() => {
    fetchNotifications();
    setTimeout(seeAllNotis, 500);
  }, [notiTrigger]);

  return (
    <div id="notifications-wrapper">
      <h2 id="notifications-title">Notifications</h2>
      {notifications.length ? (
        notifications.map((notification) => {
          return (
            <NotificationItemHandler
              setNotiTrigger={setNotiTrigger}
              notiTrigger={notiTrigger}
              key={notification.id}
              token={token}
              notification={notification}
            />
          );
        })
      ) : (
        <> no notifications</>
      )}
    </div>
  );
};
export default NotificationPage;
