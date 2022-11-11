import React from 'react';
import NewFriendRequest from './NewFriendRequest';


const NotificationItemHandler = ({token, notification}) => {



    return(
        <div>
            {notification.type === "friendRequest" ?
            <NewFriendRequest
            notification={notification}
            token={token}/> : null}
        </div>
    )
}

export default NotificationItemHandler