import React from "react";
import { acceptFriend } from "../../api";

const NewFriendRequest = ({token, notification, notiTrigger, setNotiTrigger}) => {


    const acceptFriendButton = async() => {
        const friend = await acceptFriend(token, notification.miscId, notification.id)
        if(friend.success){
            setNotiTrigger(!notiTrigger)
        }
    }

    const tempStyle = {
        height:'50px'
    }
    return (
        <div style={tempStyle}>
            {notification.text}
            <button onClick={() => {
                acceptFriendButton()
            }}>Accept</button>
            <button>Delete</button>
        </div>
    )
}

export default NewFriendRequest;