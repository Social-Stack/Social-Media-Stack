//IGNORE THIS FILE. KEEPING THE CODE SOMEWHERE FOR POSSIBLE FUTURE USE IF ANYBODY WANTS IT

// import { useEffect, useState } from "react";
// import {
//   getAllMyMessages,
//   getMyUserInfo,
//   getFriendMessages,
//   sendMessage,
//   deleteMessage,
// } from "../api";
// import Conversation from "./Conversation";
// import "../stylesheets/Messages.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import timeAgo from "node-time-ago";

// const Messages = (props) => {
//   // const { token } = props;
//   const token = localStorage.getItem("token");
//   const [allMessages, setAllMessages] = useState([]);
//   const [admin, setAdmin] = useState(false);
//   const [myId, setMyId] = useState("");
//   const [conversation, setConversation] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loadingTrigger, setLoadingTrigger] = useState(true);
//   const [text, setText] = useState("");

//   useEffect(() => {
//     const getChatlist = async () => {
//       const { id, isAdmin } = await getMyUserInfo(token);
//       setMyId(id);
//       setAdmin(isAdmin);
//       const myMessages = await getAllMyMessages(token, id);
//       setAllMessages(myMessages.allMyMessages);
//     };

//     getChatlist();
//   }, [loadingTrigger]);

//   const result = allMessages.reduce((groupedMessages, message) => {
//     const sendingUserId = message.sendingUserId;
//     if (groupedMessages[sendingUserId] == null)
//       groupedMessages[sendingUserId] = [];
//     groupedMessages[sendingUserId].push(message);
//     return groupedMessages;
//   }, []);

//   const handleClick = async (friendUserId, i) => {
//     const _conversation = await getFriendMessages(token, friendUserId);
//     setConversation(_conversation.messagesBetweenUsers);
//     if (selected === i) {
//       return setSelected(null);
//     }
//     setSelected(i);
//     setText("");
//     // setLoadingTrigger(!loadingTrigger);
//   };

//   const handleSend = async (friendUserId) => {
//     console.log("friendUserId", friendUserId);
//     const sent = await sendMessage(friendUserId, new Date(), text, token);
//     console.log("SENT MESSAGE", sent);
//     // setLoadingTrigger(!loadingTrigger);
//     // setConversation((prev) => [...prev, sent.newMessage]);
//     const _conversation = await getFriendMessages(token, friendUserId);
//     setConversation(_conversation.messagesBetweenUsers);
//     setText("");
//   };

//   const handleDelete = async (messageId, friendUserId) => {
//     console.log("MESSAGE ID", messageId);
//     const deletedMessage = await deleteMessage(token, messageId);
//     console.log("DELETED MESSAGE", deletedMessage);
//     const _conversation = await getFriendMessages(token, friendUserId);
//     setConversation(_conversation.messagesBetweenUsers);
//     setLoadingTrigger(!loadingTrigger);
//   };

//   return (
//     <div>
//       <h1 id="messages-heading">Messages</h1>
//       <div id="outer">
//         <div id="chatbox">
//           {!result.length ? (
//             <h2>You have no messages</h2>
//           ) : (
//             result.map((groupedMessage, i) => {
//               const friendUserId = groupedMessage[0].sendingUserId;
//               return (
//                 <div className="single-message">
//                   <div
//                     className="friend"
//                     onClick={() => handleClick(friendUserId, i)}
//                   >
//                     <img src={groupedMessage[0].sendingprofilepic} />
//                     <p>
//                       <strong className="single-message-sender">
//                         {groupedMessage[0].sendingfirstname}{" "}
//                         {groupedMessage[0].sendinglastname}{" "}
//                       </strong>
//                     </p>
//                     <p id="recent-message">
//                       {groupedMessage[groupedMessage.length - 1].text}{" "}
//                       {timeAgo(groupedMessage[groupedMessage.length - 1].time)}
//                     </p>
//                     <div
//                       className={
//                         friendUserId % 2 == 0
//                           ? "status available"
//                           : "status away"
//                       }
//                     ></div>
//                   </div>
//                   <div className="expanded-messages">
//                     {selected
//                       ? conversation.map((singleMessage) => {
//                           const date = new Date(singleMessage.time);
//                           const time = date.toLocaleString();
//                           return (
//                             <div
//                               className={
//                                 singleMessage.sendingUserId === friendUserId
//                                   ? "friends-message message"
//                                   : "my-message message"
//                               }
//                             >
//                               <div
//                                 className={
//                                   selected === i
//                                     ? "single-message-expanded"
//                                     : "single-message-collapsed"
//                                 }
//                               >
//                                 <div className="inline-message">
//                                   {admin ||
//                                   singleMessage.sendingUserId === myId ? (
//                                     <span>
//                                       <FontAwesomeIcon
//                                         icon="fa-solid fa-trash"
//                                         onClick={() =>
//                                           handleDelete(
//                                             singleMessage.id,
//                                             friendUserId
//                                           )
//                                         }
//                                       />
//                                     </span>
//                                   ) : null}
//                                   <div className="single-message-text bubble">
//                                     {singleMessage.text}{" "}
//                                   </div>
//                                 </div>
//                                 <div className="single-message-time">
//                                   {" "}
//                                   {timeAgo(time)}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })
//                       : null}
//                     <div
//                       className={
//                         selected === i
//                           ? "single-message-expanded"
//                           : "single-message-collapsed"
//                       }
//                     >
//                       <div id="sendmessage">
//                         <textarea
//                           className="message-input"
//                           type="text"
//                           maxLength={255}
//                           placeholder="Enter message here"
//                           value={text}
//                           onChange={(event) => {
//                             setText(event.target.value);
//                           }}
//                         />
//                         <button
//                           // id="send"
//                           disabled={!text}
//                           onClick={() => handleSend(friendUserId)}
//                         >
//                           <FontAwesomeIcon icon="fa-solid fa-message" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//         <div id="message-container">hi</div>
//       </div>
//     </div>
//   );
// };

// export default Messages;
