import React, { useEffect, useState } from 'react';
import { getUnseenNotifications } from '../../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../stylesheets/NotificationIcon.css';

const NotificationIcon = ({ token }) => {
  const [unseen, setUnseen] = useState([]);

  const getUnseen = async () => {
    if (token) {
      const notis = await getUnseenNotifications(token);
      setUnseen(notis);
    }
  };

  useEffect(() => {
    setInterval(getUnseen, 30000);
  }, [token]);

  return (
    <div id='notiIcon'>
      {/* {<FontAwesomeIcon icon="fa-regular fa-bell" />} */}
      {unseen.length > 0 ? <div id='alert'></div> : null}
      {<FontAwesomeIcon id='bell' icon='fa-regular fa-bell' />}
    </div>
  );
};
export default NotificationIcon;
