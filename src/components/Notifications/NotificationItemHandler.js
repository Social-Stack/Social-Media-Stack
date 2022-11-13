import React from 'react';
import NewFriendRequest from './NewFriendRequest';


const NotificationItemHandler = ({token, notification, setNotiTrigger, notiTrigger}) => {



    return(
        <div>
            {notification.type === "friendRequest" ?
            <NewFriendRequest
            notiTrigger={notiTrigger}
            setNotiTrigger={setNotiTrigger}
            notification={notification}
            token={token}/> : null}
        </div>
    )
}

export default NotificationItemHandler