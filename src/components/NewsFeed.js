import React, { useEffect, useState } from 'react';
import {
  getMyUserInfo,
  getMyFriends,
  getNewsFeed
} from '../api';
import NewPost from './NewPost';
import SinglePost from './SinglePost';
import { NewsFeedLeftPanel } from './NewsFeedLeftPanel';
import FriendPanel from './NewsFeedFriendPanel';
import '../stylesheets/NewsFeed.css';

const NewsFeed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [width, setWidth] = useState('');
  const token = localStorage.getItem('token')

  const getAllFriends = async () => {
    if(token){
    const { id } = await getMyUserInfo(token);
    const myFriends = await getMyFriends(token, id);
    setFriends(myFriends.friendsLists);
    }
  };

  const fetchPosts = async () => {
    const feed = await getNewsFeed(token);
    setAllPosts(feed);
  };

  
  useEffect(() => {
    setWidth('newsfeed-NewPostBox');
    fetchPosts();
    getAllFriends();
    setInterval(getAllFriends, 30000)
  }, []);

  return (
    <>
      {/* <button onClick={() => helpFunction()}>helper</button> */}
      <div id='main-content-container'>
        <NewsFeedLeftPanel token={token} />
        <div id='newsfeed-container'>
          <NewPost
            token={token}
          />
          <div id='posts-container'>
            {allPosts[0]
              ? allPosts.map((post, i) => {
                  return <SinglePost key={i} post={post} token={token} />;
                })
              : null}
          </div>
        </div>
        <div id='side-panel-container'>
          <div id='side-panel'>
            <h3 id='side-panel-title'>Friends</h3>
            <div id='side-panel-friends'>
              {friends
                ? friends.map(friend => {
                    return (
                      <FriendPanel
                        key={friend.id}
                        friend={friend}
                      ></FriendPanel>
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
