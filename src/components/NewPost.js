import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as API from '../api';

import '../stylesheets/NewPost.css';
const NewPost = ({ token, width }) => {
  const [text, setText] = useState('');
  const [commentText, setCommentText] = useState('');
  const [visibility, setVisibility] = useState('friends');
  const [user, setUser] = useState({});
  const [createdPost, setCreatedPost] = useState({ isSet: false });
  const postIdRef = useRef(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const checkIsPublic = () => visibility === 'public';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const _newPost = await API.newPost(
      token,
      text,
      new Date(),
      checkIsPublic()
    );
    if (_newPost && _newPost.success) {
      const { newPost } = _newPost;
      postIdRef.current = newPost.id;
      setCreatedPost({
        isSet: true,
        text: text
      });
      setText('');
      setSuccessMsg('Post created!');
    } else {
      setErrorMsg('Post Creation Failed. Try again.');
    }
  };

  const postComment = async (event) => {
    event.preventDefault();
    if (commentText) {
      await API.newComment(
        token,
        postIdRef.current,
        new Date(),
        commentText
      );
      location.reload(true);
    }
    setCommentText('');
  };

  const handleVisibility = (newVis) => {
    setVisibility(newVis);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setUser(await API.getMyUserInfo(localStorage.getItem('token')));
    };
    fetchUser();
  }, []);

  return (
    <div id='new-post-wrapper'>
      <div id='newPostBox' className={width}>
        <h3 id='user-welcome'>Welcome back, {user.firstname}</h3>
        <form
          id='new-post-form'
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          <textarea
            id='newPostTextBox'
            type='text'
            placeholder="What's on your mind?"
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <div id='newPostBottomBar'>
            <label id='post-visibility-text'>Visibility: </label>
            <select
              id='post-visibility-selector'
              onChange={(event) => {
                handleVisibility(event.target.value);
              }}
            >
              <option value='friends'>Friends Only</option>
              <option value='public'>Public</option>
            </select>
            <button type='submit' id='post-button'>
              Post!
            </button>
          </div>
        </form>
      </div>
      {successMsg ? (
        <div id='success-msg'>{successMsg}</div>
      ) : errorMsg ? (
        <div id='error-msg'>{errorMsg}</div>
      ) : null}
      {createdPost.isSet ? (
        <div id='post-wrapper'>
          <div id='post-content'>
            <div id='post-author-info'>
              <img id='post-author-profile-pic' src={user.picUrl} />
              <div id='name-time-wrapper'>
                <Link to={`/profile/${user.username}`}>
                  <h4 id='post-author-name'>
                    {user.firstname} {user.lastname}
                  </h4>
                </Link>
                <div id='post-time'>Just now</div>
              </div>
            </div>
            <div id='post-text'>{createdPost.text}</div>
          </div>
          <h6>No comments for this post</h6>
          <div id='new-comment-wrapper'>
            <img id='new-comment-user-pic' src={user.picUrl}></img>
            <form
              id='new-comment-form'
              onSubmit={(event) => {
                postComment(event);
              }}
            >
              <input
                id='new-comment-input'
                placeholder='Share your thoughts...'
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              ></input>
              <input type='submit' style={{ display: 'none' }}></input>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NewPost;
