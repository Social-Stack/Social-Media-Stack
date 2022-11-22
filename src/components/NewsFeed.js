import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllPublicPosts,
  getMyUserInfo,
  getMyFriends,
  getNewsFeed
} from '../api';
import NewPost from './NewPost';
import SinglePost from './SinglePost';
import { NewsFeedLeftPanel } from './NewsFeedLeftPanel';
import '../stylesheets/NewsFeed.css';

const NewsFeed = ({ token }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [loadingTrigger, setLoadingTrigger] = useState(true);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    getAllFriends();
  }, [loadingTrigger, token]);

  const getAllFriends = async () => {
    const { id } = await getMyUserInfo(token);
    const myFriends = await getMyFriends(token, id);
    setFriends(myFriends.friendsLists);
  };

  const fetchPosts = async () => {
    const feed = await getNewsFeed(token);
    setAllPosts(feed);
  };
  // const helpFunction = async() => {
  //   console.log(await getNewsFeed(token))
  // }

  const handleFriendNavigate = username => {
    navigate(`/profile/${username}`);
  };

  return (
    <>
      {/* <button onClick={() => helpFunction()}>helper</button> */}
      <NewPost
        token={token}
        loadingTrigger={loadingTrigger}
        setLoadingTrigger={setLoadingTrigger}
      />
      <div id='main-content-container'>
        <NewsFeedLeftPanel token={token} />
        <div id='newsfeed-container'>
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
                ? friends.map((friend, i) => {
                    return (
                      <div
                        id='side-panel-friend'
                        key={i}
                        onClick={handleFriendNavigate.bind(
                          null,
                          friend.username
                        )}
                      >
                        <img
                          id='friend-img'
                          height='50px'
                          src={friend.picUrl}
                        />
                        <p id='friend-name'>
                          {friend.firstname} {friend.lastname}
                        </p>
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
