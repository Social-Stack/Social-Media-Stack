import React, {useEffect, useState} from "react";
import { getMyUserInfo, newComment } from "../api";

import "../stylesheets/NewComment.css";

const NewComment = ({token, postId, reloadComTrigger, setReloadComTrigger}) => {
    const [text, setText] = useState('');
    const [user, setUser] = useState({});

    const placeText = "Share your thoughts...";

    const fetchUserData = async() => {
      const token = localStorage.getItem("token")
      setUser(await getMyUserInfo(token))
    }

    const postComment = async(event) => {
        event.preventDefault();
        if(text){
            await newComment(token, postId, new Date(), text);
            setReloadComTrigger(!reloadComTrigger);
        }
        setText('')
    }

    useEffect(() => {
      fetchUserData();
    }, [])

    return(
      <div id="new-comment-wrapper">
        <img id="new-comment-user-pic" src={user.picUrl}></img>
        <form
        id="new-comment-form"
        onSubmit={(event) => {postComment(event)}}>
          <input 
          id='new-comment-input' 
          placeholder={placeText} 
          value={text} 
          onChange={(event)=>setText(event.target.value)}>
          </input>
          <input type='submit' style={{display: 'none'}}></input>
        </form>
      </div>
    )
}


export default NewComment;