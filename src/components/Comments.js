import { 
  useEffect, 
  useState 
} from "react";
import { 
  getCommentsByPostId,
  addUpvoteToComment,
  removeUpvoteFromComment,
  editComment,
  removeComment
 } from "../api";
import "../stylesheets/Comments.css";
import timeAgo from "node-time-ago"

const Comments = ({
  postId,
  reloadComTrigger,
  setReloadComTrigger
}) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [postComments, setPostComments] = useState([]);
  const [editingStatus, setEditingStatus] = useState({ editing: false, commentId: 0 });
  const [confirmDelete, setConfirmDelete] = useState({ warning: false, commentId: 0 });
  const [editText, setEditText] = useState("")

  const fetchComments = async() => {
    const { comments } = await getCommentsByPostId(postId, token);
    return setPostComments(comments);
  }
  
  const fetchData = async() => {
    await fetchComments();
  }
  
  const upvoteHandler = async(upvoteStatus, commentId) => {
    upvoteStatus.includes('false') ?
    await addUpvoteToComment(commentId, token) :
    await removeUpvoteFromComment(commentId, token)
    setReloadComTrigger(!reloadComTrigger)
  }

  const editOnClick = (commentText, commentId) => {
    const prevStatus = !editingStatus.editing;
    setEditText(commentText);
    setEditingStatus({ editing: prevStatus, commentId })
    setReloadComTrigger(!reloadComTrigger)
  }

  const handleEdit = async(e, commentId) =>{
    e.preventDefault();
    await editComment(commentId, editText, token)
    setEditingStatus({ editing: false, commentId: 0 })
    setReloadComTrigger(!reloadComTrigger)
  }

  const deleteOnClick = (commentId) => {
    setConfirmDelete({ warning: true, commentId });
  }

  const handleDelete = async(commentId) => {
    await removeComment(commentId, token);
    setConfirmDelete({ warning: false, commentId: 0 })
    setReloadComTrigger(!reloadComTrigger);
  }

  const removeWarning = () => {
    setConfirmDelete({ warning: false, commentId: 0 })
  }
  
  useEffect(() => {
      fetchData();
  }, [reloadComTrigger]);

  return (
    <>
      <h5>Comments</h5>
        {
          postComments.length ?
          postComments.map(comment => {
            return (
              <div id="comments-wrapper">
                <div id="comment-header">
                    <div id="author-info" key={comment.id}>
                      <img id="comment-prof-pic" src={comment.picUrl} width="25px" height="25px"></img>
                      <h6>{comment.authorName}</h6>
                    </div>
                    {comment.authorId == userId ?
                    <div id="edit-del-btns">
                      <h6 id="edit-btn" onClick={() => editOnClick(comment.text, comment.id)}>Edit</h6>
                      <pre> | </pre>
                      <h6 id="delete-btn" onClick={() => deleteOnClick(comment.id)}>Delete</h6>
                    </div>
                    : <div id="edit-del-btns"></div>
                    }
                </div>
                <div id="comment-body">
                  {
                    editingStatus.editing && editingStatus.commentId === comment.id ?
                    <form onSubmit={(e) => handleEdit(e, comment.id)}>
                      <textarea
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}>
                      </textarea>
                      <button id="edit-submit">Submit</button>
                    </form>
                    :
                    confirmDelete.warning && confirmDelete.commentId === comment.id ?
                    <>
                      <body>{comment.text}</body>
                      <div id="delete-warning">Are you sure?</div>
                      <button onClick={() => handleDelete(comment.id)}>Yes</button>
                      <button onClick={() => removeWarning()}>No</button>
                    </>
                    : 
                    <body>{comment.text}</body>
                  }
                </div>
                <div id="comment-footer">
                  <div className="upvotes">
                    <div id={`user-has-upvoted-${comment.userHasUpvoted}`}
                    className='upvote-status'
                    onClick={(e) => upvoteHandler(e.currentTarget.id, comment.id)}>
                    </div>{comment.upvotes}
                  </div>
                  <pre> | </pre>
                  <div className="time">
                    <div>Posted</div>
                    <div>{timeAgo(comment.time)}</div>
                  </div>
                  {
                    comment.updateTime ?
                    <>
                      <pre> | </pre>
                      <div className="update-time">
                        <div>Updated</div> 
                        <div>{timeAgo(comment.updateTime)}</div>
                      </div>
                    </>
                    : null
                  }
                </div>
              </div>
            )
          })
          :
          <h6>No comments for this post</h6>
          }
    </>
  )
}

export default Comments;