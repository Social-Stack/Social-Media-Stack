import { 
  useEffect, 
  useState 
} from "react";
import { 
  getCommentsByPostId,
 } from "../api";
import "../stylesheets/Comments.css";
import timeAgo from "node-time-ago"

const Comments = ({
  postId
}) => {
  // const token = localStorage.getItem("token");
  const [postComments, setPostComments] = useState([]);
  // const [commentUpvotes, setCommentUpvotes] = useState([]);

  useEffect(() => {
      fetchData();
  }, []);

  const fetchComments = async() => {
    const { comments } = await getCommentsByPostId(postId);
    return setPostComments(comments);
  }

  const fetchData = async() => {
    await fetchComments();
  }

  return (
    <>
      <h5>Comments</h5>
      <div id="comments-wrapper">
        {
          postComments.length ?
          postComments.map(comment => {
            return (
              <>
                <div id="comment-header">
                  <div id="author-info" key={comment.id}>
                      <img id="comment-prof-pic" src={comment.picUrl} width="25px" height="25px"></img>
                      <h6>{comment.authorName}</h6>
                  </div>
                </div>
                <div id="comment-body">
                  <body>{comment.text}</body>
                </div>
                <div id="comment-footer">
                  <div className="upvotes"><div id="user-has-upvoted-true"></div>1</div>
                  <div className="time">| {timeAgo(comment.time)}</div>
                </div>
                <dev>
                  DEV NOTE: Overhauling upvotes to make them quicker to add to a comment, 
                  some values are static for the time being.
                </dev>
              </>
            )
          })
          :
          <h6>No comments for this post</h6>
          }
      </div>
    </>
  )
}

export default Comments;