import React, { useState } from "react";
import { sendMessage } from "../api";

const ProfileMessage = ({ token, userInfo, setSendingMessage }) => {
  const [messageText, setMessageText] = useState(`Hi ${userInfo.firstname}!`);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(userInfo.id, new Date(), messageText, token);
    setSendingMessage(false);
  };

  const handleKeyDown = (e) => {
    if (e.key == "Enter" && e.shiftKey == false) {
      handleSubmit(e);
    }
  };

  return (
    <div>
      <form id="message-profile-container" onSubmit={handleSubmit}>
        <textarea
          id="message-area"
          placeholder={`Send a message to ${userInfo.firstname} ${userInfo.lastname}`}
          onKeyDown={(e) => handleKeyDown(e)}
          value={messageText}
          onChange={(event) => {
            setMessageText(event.target.value);
          }}
        ></textarea>
        <button id="profile-message-sendbtn" type="submit">
          Send
        </button>
        <button
          id="profile-message-cancelbtn"
          onClick={() => {
            setSendingMessage(false);
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProfileMessage;
