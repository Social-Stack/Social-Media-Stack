//friends +15
//upvotes +1
//own post +2
//comments +2
//add points for recency +20

const { getCommentsByPostId } = require('./comments');
const { getFriendsListByUserId } = require('./friendsLists');
const { getPostById } = require('./posts');
const { getPostUpvotesById } = require('./post_upvotes');

const comparePoints = (a, b) => {
  if (a.points > b.points) {
    return -1;
  } else if (a.points < b.points) {
    return 1;
  } else {
    return 0;
  }
};

const sortPostsArray = async (postsArr, userId) => {
  const friends = await getFriendsListByUserId(userId);
  // console.log("UID:", userId)
  // console.log("FRIENDS", friends)
  for (let i = 0; i < postsArr.length; i++) {
    let points = 0;
    const currPost = postsArr[i];
    const postContent = await getPostById(currPost.id);
    if (friends.includes(postContent.userId)) {
      points += 15;
      console.log(currPost)
    }
    if (currPost.userId === userId) {
      if (+currPost.time + 180000 > Date.now()) {
        // convert post time to number, add 3 minutes and compare to current time (ms)
        // if own post is less than 3 minutes old, show at the top
        points += 500000;
      }
      points += 2;
    }
    const comments = await getCommentsByPostId(currPost.id);
    points += comments.length;
    const { upvotes } = await getPostUpvotesById(currPost.id);
    points += upvotes;
    currPost.points = points;
  }
  postsArr.sort(comparePoints);
  return postsArr;
};

module.exports = {
  sortPostsArray
};
