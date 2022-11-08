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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const handleKeyDown = (e, commentId) => {
    if (e.key == 'Enter' && e.shiftKey == false) {
      handleEdit(e, commentId);
    }
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
      {
        postComments.length ?
        postComments.map(comment => {
          return (
            <div id="comments-wrapper" key={comment.id}>
              <div id="comment-body">
              <img id="comment-author-profile-pic" src={comment.picUrl}></img>
                {
                  editingStatus.editing && editingStatus.commentId === comment.id ?
                  <div id="comment-edit-form-wrapper">
                    <div id="comment-editing-warning">Editing</div>
                    <form 
                    onSubmit={(e) => handleEdit(e, comment.id)}
                    id="comment-edit-form">
                      <textarea
                      id="comment-edit-input"
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, comment.id)}
                      >
                      </textarea>
                    </form>
                  </div>
                  :
                  confirmDelete.warning && confirmDelete.commentId === comment.id ?
                  <div id="comment-text-with-warning">
                    <div id="comment-text">
                      <h5>{comment.authorName} {comment.lastname}</h5>
                      <main>{comment.text}</main>
                    </div>
                    <div id="comment-delete-confirm-wrapper">
                      <div id="delete-warning">Are you sure?</div>
                      <div id="comment-delete-confirmation">
                        <div onClick={() => handleDelete(comment.id)}>Yes</div>
                        <div onClick={() => removeWarning()}>No</div>
                      </div>
                    </div>
                  </div>
                  :
                  <>
                    <div id="comment-text">
                      <h5>{comment.authorName} {comment.lastname}</h5>
                      <main>{comment.text}</main>
                    </div>
                  </>
                }
              </div>
              <div id="comment-footer">
                <div className="upvotes">
                  <FontAwesomeIcon id={`user-has-upvoted-${comment.userHasUpvoted}`}
                  icon="fa-solid fa-arrow-up"
                  className='upvote-status'
                  onClick={(e) => upvoteHandler(e.currentTarget.id, comment.id)}
                  />
                  <div>{comment.upvotes}</div>
                </div>
                <div id="comment-time-container">
                  <div id="comment-time">{timeAgo(comment.time)}</div>
                {
                  comment.updateTime ?
                  <div id="edited">Edited</div>
                  : null
                }
                </div>
                <div id="edit-del-btns">
                  {
                  comment.authorId == userId 
                  && editingStatus.editing 
                  && editingStatus.commentId === comment.id ?
                  <>
                    <h6 id="edit-btn" onClick={() => editOnClick(comment.text, comment.id)}>Cancel</h6>
                    <h6 id="delete-btn" onClick={() => deleteOnClick(comment.id)}>Delete</h6>
                  </>
                  :
                  comment.authorId == userId ?
                  <>
                    <h6 id="edit-btn" onClick={() => editOnClick(comment.text, comment.id)}>Edit</h6>
                    <h6 id="delete-btn" onClick={() => deleteOnClick(comment.id)}>Delete</h6>
                  </>
                  : <div id="edit-del-btns"></div>
                  }
                </div>
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