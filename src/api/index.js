// require('dotenv').config()

const BASE_URL = process.env.REACT_APP_API_URL;

// const BASE_URL = 'http://localhost:4000/api'

//Register
export const registerUser = async (user) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        password: user.password,
        confirmPassword: user.confirmPassword,
        email: user.email,
        picUrl: user.picUrl
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

//Login
export const loginUser = async (user) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

//profile

export const getProfileData = async (token, username) => {
  try {
    const response = await fetch(`${BASE_URL}/users/profile/${username}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

//posts
export const getAllPublicPosts = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/public`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getNewsFeed = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/newsfeed`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getPostsByUserId = async (token, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const newPost = async (token, _text, _time, _isPublic) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        text: _text,
        time: _time,
        isPublic: _isPublic
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getCommentsByPostId = async (postId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/${postId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

//comments
export const newComment = async (token, postId, time, text) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        text,
        time
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const editComment = async (commentId, text, token) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        text,
        time: new Date()
      })
    });
    const result = response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const removeComment = async (commentId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const addUpvoteToComment = async (commentId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/comment_upvotes/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: commentId
      })
    });
    const result = response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const removeUpvoteFromComment = async (commentId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/comment_upvotes/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        id: commentId
      })
    });
    const result = response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const getAllMyMessages = async (token, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/chatlist`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getMyUserInfo = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getFriendMessages = async (token, friendUserId) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/chat/${friendUserId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const sendMessage = async (recipientUserId, time, text, token) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        recipientUserId,
        text,
        time
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getMyFriends = async (token, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/friendsLists/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const requestFriend = async (token, requestedFriendUsername) => {
  try {
    const response = await fetch(
      `${BASE_URL}/friendRequests/new/${requestedFriendUsername}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const acceptFriend = async (token, newFriendId) => {
  try {
    const response = await fetch(`${BASE_URL}/friendsLists/${newFriendId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const denyFriend = async (token, requestedFriendId) => {
  try {
    const response = await fetch(`${BASE_URL}/friendRequests/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        requestedFriendId
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getFriendStatus = async (token, username) => {
  try {
    const response = await fetch(
      `${BASE_URL}/friendsLists/status/${username}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const deleteMessage = async (token, messageId) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getAFriend = async (token, friendId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${friendId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getAllMyNotifications = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getUnseenNotifications = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/unseen`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const seeNotification = async (token, notiId) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/seen/${notiId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const seeMyNotifications = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/seeall`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};
