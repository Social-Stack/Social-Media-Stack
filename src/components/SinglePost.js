import React,{useEffect, useState} from "react";
import { getCommentsByPostId } from "../api";
import SinglePostComment from "./SinglePostComment";


const SinglePost = ({post}) => {
    const [comments, setComments] = useState([]);

    const loadComments = async() => {
        const postComments = await getCommentsByPostId(post.id);
        console.log(postComments)
        setComments(postComments);
    }

    useEffect(() => {
        loadComments();
    },[])


    const tempStyle = {
        border:'solid',
        width:'500px',
        margin:'5px',
        display:'flex',
        flexDirection:'column'
    }

    return (
        <div style={tempStyle}>
            <div style={{display:'flex'}}>
                <img id="profile-pic" src={post.profilePic} />
                <div>
                    <div>{post.firstname} {post.lastname}</div>
                    <div>{post.time}</div>
                </div>
            </div>
            <div>{post.text}</div>
            <div>
                <>comments:</>
                {comments[0] && comments.map((comment) => {
                    return(
                        <SinglePostComment
                        key={comment.id}
                        comment={comment}/>
                    )
                })}
            </div>
        </div>
    )
}
export default SinglePost;