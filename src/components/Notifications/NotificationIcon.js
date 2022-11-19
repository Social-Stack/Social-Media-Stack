import React, { useEffect, useState } from "react";
import { getUnseenNotifications } from "../../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotificationIcon = ({ token }) => {
  const [unseen, setUnseen] = useState([]);

  const getUnseen = async () => {
    if (token) {
      const notis = await getUnseenNotifications(token);
      setUnseen(notis);
    }
  };

  useEffect(() => {
    // setInterval(getUnseen, 10000);
  }, [token]);

  return (
    <>
      {unseen.length}
      <FontAwesomeIcon icon="fa-regular fa-bell" />
    </>
  );
};
export default NotificationIcon;
