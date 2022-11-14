import React from "react";
import { acceptFriend, denyFriend } from "../../api";

const NewFriendRequest = ({token, notification, notiTrigger, setNotiTrigger}) => {


    const acceptFriendButton = async() => {
        const friend = await acceptFriend(token, notification.miscId, notification.id);
        if(friend.success){
            setNotiTrigger(!notiTrigger);
        }
    };

    const denyFriendButton = async() => {
        await denyFriend(token, notification.miscId, notification.id);
        setNotiTrigger(!notiTrigger);
    };

    const tempStyle = {
        height:'50px'
    }
    return (
        <div style={tempStyle}>
            {notification.text}
            <button onClick={() => {
                acceptFriendButton()
            }}>Accept</button>
            <button onClick={()=>{denyFriendButton()}}>Delete</button>
        </div>
    )
}

export default NewFriendRequest;