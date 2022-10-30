import React from "react";

const SinglePostComment = ({comment}) => {


    const tempStyle={
        display:'flex',
        flexDirection:'column',
        backgroundColor:'aqua',
        border:'solid',
        margin: '2px',
        padding:'5px'
    }
    console.log(comment)
    //dont mind the bad style just focusing on functionality

    return (
        <div style={tempStyle}>
            <div>{comment.firstname} {comment.lastname}</div>
            <p>{comment.text}</p>
        </div>
    )
}

export default SinglePostComment