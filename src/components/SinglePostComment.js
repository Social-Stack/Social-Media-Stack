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

    return (
        <div style={tempStyle}>
            <div>{comment.firstname} {comment.lastname}</div>
            <p>{comment.text}</p>
        </div>
    )
}

export default SinglePostComment