import React from "react";
import { acceptFriend, denyFriend, requestFriend } from "../api";

const ProfileFriendButton = ({
  token,
  status,
  username,
  profileReloadTrigger,
  setProfileReloadTrigger,
}) => {
  const acceptFriendButton = async () => {
    await acceptFriend(token, username);
    setProfileReloadTrigger(!profileReloadTrigger);
  };

  const denyFriendButton = async () => {
    await denyFriend(token, username);
    setProfileReloadTrigger(!profileReloadTrigger);
  };

  const requestFriendButton = async () => {
    await requestFriend(token, username);
    setProfileReloadTrigger(!profileReloadTrigger);
  };
  return (
    <div id="friend-request-status">
      {status === "awaiting response" && <>friend request sent</>}
      {status === "awaiting You" && (
        <>
          <button
            id="accept-friend-btn"
            onClick={() => {
              acceptFriendButton();
            }}
          >
            Accept
          </button>
          <button
            id="decline-friend-btn"
            onClick={() => {
              denyFriendButton();
            }}
          >
            Delete
          </button>
        </>
      )}
      {status === "request" && (
        <button
          id="add-friend-btn"
          onClick={() => {
            requestFriendButton();
          }}
        >
          Add Friend
        </button>
      )}
    </div>
  );
};

export default ProfileFriendButton;
