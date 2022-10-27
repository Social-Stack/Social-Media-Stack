import React from "react";


const SinglePost = ({post}) => {
    //component for posts to get mapped into

    
    const tempStyle = {
        border:'solid',
        height:'50px',
        width:'500px'
        
    }


    return (
        <div style={tempStyle}>
            {post.text}
        </div>
    )
}
export default SinglePost;