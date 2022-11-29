import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import timeAgo from 'node-time-ago';
import '../stylesheets/FriendPanel.css';

const FriendPanel = ({ friend }) => {
  const [lastSeen, setLastSeen] = useState('Online');

  const navigate = useNavigate();

  useEffect(() => {
    setInterval(setSeen,30000);
  }, []);

  const onlineTimes = [
   'second',
    'a minute ago',
    '2 minutes ago',
    '3 minutes ago',
    '4 minutes ago'
  ];
  const checkMinutes = () => {
    for (let i = 0; i < onlineTimes.length; i++) {
      if (timeAgo(friend.lastActive).includes(onlineTimes[i])) {
        return true;
      }
    }
    return false;
  };

  const setSeen = () => {
    if (timeAgo(friend.lastActive) === 'just now' || checkMinutes()) {
      setLastSeen('Online');
    } else {
      setLastSeen(timeAgo(friend.lastActive));
    }
  };

  const handleFriendNavigate = username => {
    navigate(`/profile/${username}`);
  };

  return (
    <div id='side-panel-friend' onClick={handleFriendNavigate.bind(null, friend.username)}>
      <img id='friend-img' height='50px' src={friend.picUrl} />
      <div>
        <p>
          {friend.firstname} {friend.lastname}
        </p>
        <div id='fp-status-wrapper'>
          <div className={lastSeen === 'Online' ? 'Online' : 'Offline'}></div>
          <p id='fp-last-seen'>{lastSeen}</p>
        </div>
      </div>
    </div>
  );
};

export default FriendPanel;
