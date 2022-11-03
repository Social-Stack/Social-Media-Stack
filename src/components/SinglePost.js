import React,{useEffect, useState} from "react";
import { NewComment, Comments } from "./";
import timeAgo from "node-time-ago"


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


    const tempStyle = {
        border:'solid',
        width:'500px',
        margin:'5px',
        display:'flex',
        flexDirection:'column'
    }

    //dont mind the bad style just focusing on functionality


    return (
        <div style={tempStyle}>
            <div style={{display:'flex'}}>
                <img id="profile-pic" src={post.profilePic} />
                {/* <img style ={{height:'50', width:'50'}} src={require(`./Assets/defaultPic.png`)}></img> offline mode for Fred in the sky */}
                <div>
                    <div>{post.firstname} {post.lastname}</div>
                    <div>{timeAgo(post.time)}</div>
                </div>
            </div>
            <div>{post.text}</div>
            <div>
            <Comments 
            postId={post.id}
            />
            </div>
            <NewComment
            token={token}
            postId={post.id}
            reloadComTrigger={reloadComTrigger}
            setReloadComTrigger={setReloadComTrigger}></NewComment>
        </div>
    )
}
export default SinglePost;