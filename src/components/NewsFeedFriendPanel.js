import React, { useEffect, useState } from "react";
import timeAgo from "node-time-ago";
import "../stylesheets/FriendPanel.css";


const FriendPanel = ({friend, friendsTrigger}) => {
    const [lastSeen, setLastSeen] = useState('Online');

    useEffect(() => {
        setSeen();
    },[friendsTrigger])

    const onlineTimes = ["second", "a minute ago", "2 minutes ago", "3 minutes ago", "4 minutes ago"];
    const checkMinutes = () => {
        for(let i = 0; i< onlineTimes.length; i++){
            if(timeAgo(friend.lastActive).includes(onlineTimes[i])){
                return true
            }
        }
        return false
    }

    const setSeen = () => {
        if(timeAgo(friend.lastActive) === "just now" || checkMinutes()){
            setLastSeen("Online");
        } else {
        setLastSeen(timeAgo(friend.lastActive));
        }
    }

    return (
        <div id="side-panel-friend">
          <img id="friend-img" height="50px" src={friend.picUrl} />
          <div>
            <p>{friend.firstname} {friend.lastname}</p>

            <div className={lastSeen === "Online" ? "Online": "Offline"}></div>
            <p>{lastSeen}</p>
          </div>
        </div>
      )
}

export default FriendPanel;