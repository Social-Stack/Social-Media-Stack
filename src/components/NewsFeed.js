import React, { useEffect, useState } from "react";
import { getAllPublicPosts, getMyUserInfo, getMyFriends, getNewsFeed } from "../api";
import NewPost from "./NewPost";
import SinglePost from "./SinglePost";
import "../stylesheets/NewsFeed.css";

const NewsFeed = ({ token }) => {
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [allPublic, setAllPublic] = useState([]);
  const [loadingTrigger, setLoadingTrigger] = useState(true);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchPosts();
    getAllFriends();
  }, [loadingTrigger, token]);
  
  // useEffect(() => {
  // }, []);

  const getAllFriends = async () => {
    const { id } = await getMyUserInfo(token);
    const myFriends = await getMyFriends(token, id);
    setFriends(myFriends.friendsLists);
  };

  const fetchPosts = async () => {
    const newPostsArr = [];
    const getPublicPosts = await getAllPublicPosts(token);
    //const getFriendPosts
    getPublicPosts[0] && newPostsArr.push(...getPublicPosts);
    console.log(newPostsArr);
    setAllPublic(newPostsArr);
  };
  const helpFunction = async() => {
    console.log(await getNewsFeed(token))
  }

  return (
    <>
      <button onClick={() => helpFunction()}>helper</button>
      <NewPost
        token={token}
        loadingTrigger={loadingTrigger}
        setLoadingTrigger={setLoadingTrigger}
      />
      <div id="newsfeed-container">
        <div id="posts-container">
          {allPublic[0]
            ? allPublic.map((post, i) => {
                return <SinglePost key={i} post={post} token={token} />;
              })
            : null}
        </div>
        <div id="side-panel-container">
          <div id="side-panel">
            <h3 id="side-panel-title">Friends</h3>
            <div id="side-panel-friends">
              {friends
                ? friends.map((friend, i) => {
                return (
                  <div id="side-panel-friend" key={i}>
                    <img id="friend-img" height="50px" src={friend.picUrl} />
                    <p>{friend.username}</p>
                  </div>
                );
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
