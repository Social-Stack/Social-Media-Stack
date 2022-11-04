import React, {useState} from "react";
import { newComment } from "../api";

import "../stylesheets/NewComment.css";

const NewComment = ({token, postId, reloadComTrigger, setReloadComTrigger}) => {
    const [text, setText] = useState('');

    const placeText = "share your thoughts about this";

    const postComment = async(event) => {
        event.preventDefault();
        if(text){
            await newComment(token, postId, new Date(), text);
            setReloadComTrigger(!reloadComTrigger);
        }
        setText('')
    }

    //dont mind the bad style just focusing on functionality

    return(
        <form id='comment-form' onSubmit={(event) => {postComment(event)}}>
            <textarea id='newCommentTextArea' placeholder={placeText} value={text} onChange={(event)=>setText(event.target.value)}></textarea>
            <button>Comment</button>
        </form>
    )
}


export default NewComment;