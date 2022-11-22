import React, { useEffect, useState } from "react";
import { getAllPublicPosts, getMyUserInfo, getMyFriends, getNewsFeed } from "../api";
import NewPost from "./NewPost";
import SinglePost from "./SinglePost";
import "../stylesheets/NewsFeed.css";
import FriendPanel from "./NewsFeedFriendPanel";

const NewsFeed = ({ token }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [loadingTrigger, setLoadingTrigger] = useState(true);
  const [friends, setFriends] = useState([]);
  const [friendsTrigger, setFriendsTrigger] = useState(false);

  useEffect(() => {
    fetchPosts();
    getAllFriends();
    setInterval(getAllFriends, 30000);
  }, [loadingTrigger, token]);
  
  const getAllFriends = async () => {
    const { id } = await getMyUserInfo(token);
    const myFriends = await getMyFriends(token, id);
    setFriends(myFriends.friendsLists);
    setFriendsTrigger(!friendsTrigger);
  };

  const fetchPosts = async () => {
    const feed = await getNewsFeed(token);
    setAllPosts(feed);
  };
  // const helpFunction = async() => {
  //   console.log(await getNewsFeed(token))
  // }

  return (
    <>
      {/* <button onClick={() => helpFunction()}>helper</button> */}
      <NewPost
        token={token}
        loadingTrigger={loadingTrigger}
        setLoadingTrigger={setLoadingTrigger}
      />
      <div id="main-content-container">
        <div id="newsfeed-container">
          <div id="posts-container">
            {allPosts[0]
              ? allPosts.map((post, i) => {
                  return <SinglePost key={i} post={post} token={token} />;
                })
              : null}
          </div>
        </div>
        <div id="side-panel-container">
          <div id="side-panel">
            <h3 id="side-panel-title">Friends</h3>
            <div id="side-panel-friends">
              {friends
                ? friends.map((friend) => {
                // return (
                //   <div id="side-panel-friend" key={i}>
                //     <img id="friend-img" height="50px" src={friend.picUrl} />
                //     <div>
                //       <p>{friend.username}</p>
                //       <p>{timeAgo(friend.lastActive)}</p>
                //     </div>
                //   </div>
                // );
                return(
                <FriendPanel key={friend.id}
                friend={friend} friendsTrigger={friendsTrigger}></FriendPanel>)
                })
              : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NewsFeed;
