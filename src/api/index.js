const BASE_URL = "http://localhost:4000/api";

//Register
export const registerUser = async (user) => {
  console.log("USER", user);
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        password: user.password,
        confirmPassword: user.confirmPassword,
        email: user.email,
        picUrl: user.picUrl,
      }),
    });
    const result = await response.json();
    console.log("RESULT", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

//Login
export const loginUser = async (user) => {
  console.log("USER", user);
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password,
      }),
    });
    const result = await response.json();
    console.log("RESULT", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getAllPublicPosts = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/public`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: _text,
        time: _time,
        isPublic: _isPublic,
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/${postId}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const newComment = async (token, postId, time, text) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
        time,
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const removeComment = async (token, commentId) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getAllMyMessages = async (token, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/messages/chatlist`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    console.log("MESSAGES RESULT", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getMyUserInfo = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    console.log("SINGLE MESSAGES RESULT", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};
