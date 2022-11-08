import React,{useEffect, useState} from "react";
import { NewComment, Comments } from "./";
import timeAgo from "node-time-ago"
import "../stylesheets/SinglePost.css"


const SinglePost = ({post, token}) => {
    // const [comments, setComments] = useState([]);
    const [reloadComTrigger, setReloadComTrigger] = useState(false);

    // const loadComments = async() => {
    //     const postComments = await getCommentsByPostId(post.id);
    //     console.log(postComments)
    //     // setComments(postComments);
    // }

    // useEffect(() => {
    //     loadComments();
    // },[reloadComTrigger])

    return (
        <div id="post-wrapper">
            <div id="post-content">
              <div id="post-author-info">
                <img id="post-author-profile-pic" src={post.profilePic}/>
                <div id="name-time-wrapper">
                  <h4 id="post-author-name">{post.firstname} {post.lastname}</h4>
                  <div id="post-time">{timeAgo(post.time)}</div>
                </div>
              </div>
              <div id="post-text">{post.text}</div>
            </div>
            <Comments 
            postId={post.id}
            reloadComTrigger={reloadComTrigger}
            setReloadComTrigger={setReloadComTrigger}
            />
            <NewComment
            token={token}
            postId={post.id}
            reloadComTrigger={reloadComTrigger}
            setReloadComTrigger={setReloadComTrigger}></NewComment>
        </div>
    )
}
export default SinglePost;