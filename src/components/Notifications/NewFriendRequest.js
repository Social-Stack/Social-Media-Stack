import React from "react";
import { acceptFriend } from "../../api";

const NewFriendRequest = ({token, notification}) => {


    const acceptFriendButton = async() => {
        await acceptFriend(token, newFriendId)
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