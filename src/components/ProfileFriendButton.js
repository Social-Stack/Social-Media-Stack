import React from "react";
import { acceptFriend, denyFriend, requestFriend } from "../api";



const ProfileFriendButton = ({token, status, username, profileReloadTrigger, setProfileReloadTrigger}) => {

    const acceptFriendButton = async() => {
        await acceptFriend(token, notification.miscId, notification.id);
        setProfileReloadTrigger(!profileReloadTrigger);
    };

    const denyFriendButton = async() => {
        await denyFriend(token, notification.miscId, notification.id);
        setProfileReloadTrigger(!profileReloadTrigger);
    };

    const requestFriendButton = async() => {
        await requestFriend(token, username);
        setProfileReloadTrigger(!profileReloadTrigger);
    }
    return(
        <div>
            {status === 'awaiting response' && <>friend request sent</>}
            {status === 'awaiting You' && <><button onClick={() => {
                acceptFriendButton()
            }}>Accept</button>
            <button onClick={()=>{denyFriendButton()}}>Delete</button><>these won't work</></>}
            {status === 'request' && <button onClick={() => {
                requestFriendButton()
            }}>Add Friend</button>}

        </div>
    )
}

export default ProfileFriendButton