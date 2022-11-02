import { useEffect, useState } from "react";
import { getAllMyMessages, getMyUserInfo } from "../api";

const Messages = (props) => {
  //   const { token } = props;
  const token = localStorage.getItem("token");
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    const getChatlist = async () => {
      const { id } = await getMyUserInfo(token);
      //   console.log("USERINFO", userInfo);
      const myMessages = await getAllMyMessages(token, id);
      setAllMessages(myMessages.allMyMessages);
    };
    getChatlist();
  }, []);

  // const result = (allMessages) => {
  //   {
  //     allMessages.reduce(function (r, a) {
  //       r[a.sendingUserId] = r[a.sendingUserId] || [];
  //       r[a.sendingUserId].push(a);
  //       return r;
  //     }, Object.create(null));
  //   }
  // };

  const result = allMessages.reduce((groupedMessages, message) => {
    const sendingUserId = message.sendingUserId;
    if (groupedMessages[sendingUserId] == null)
      groupedMessages[sendingUserId] = [];
    groupedMessages[sendingUserId].push(message);
    return groupedMessages;
  }, []);

  console.log("REDUCE RESULT", result);

  const handleClick = (friendId) => {
    console.log("friendid", friendId);
  };

  return (
    <div>
      <h1 id="messages-heading">Messages</h1>
      {/* <div>
        {result.map((groupedMessage, i) => {
          <div>Grouped Message From: {groupedMessage.sendingusername}</div>;

          console.log("GROUPED", groupedMessage);
          return groupedMessage.map((singleMessage) => {
            <div>Grouped Message From: {groupedMessage}</div>;

            const date = new Date(singleMessage.time);
            const time = date.toLocaleString();
            <div>Grouped Message From: {groupedMessage}</div>;
            return (
              <div>
                <div>From: {groupedMessage[0].sendingusername}</div>
                {console.log("GROUPED MESSAGE 0 ", groupedMessage[0])}
                <div key={singleMessage.id}>
                  <div>{singleMessage.text}</div>
                  <div>{time}</div>
                </div>
                <br />
              </div>
            );
          });
        })}
      </div> */}

      <div>
        {result.map((groupedMessage, i) => {
          const date = new Date(groupedMessage[0].time);
          const time = date.toLocaleString();
          const friendId = groupedMessage[0].sendingUserId;
          return (
            <div className="single-message">
              <div className="single-message-sender">
                {" "}
                Message from: {groupedMessage[0].sendingusername}
              </div>
              <div className="single-message-text">
                {" "}
                {groupedMessage[0].text}
              </div>
              <div className="single-message-time"> {time}</div>
              <button onClick={() => handleClick(friendId)}>
                View Conversation
              </button>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
