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
  return (
    <div>
      <h1 id="messages-heading">Messages</h1>
      {/* <div>Result: {result.text}</div> */}
      <div>
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
                {/* <br /> */}
                <div key={singleMessage.id}>
                  <div>{singleMessage.text}</div>
                  <div>{time}</div>
                </div>
                <br />
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default Messages;
