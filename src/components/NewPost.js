import React, {useState} from "react";
import { newPost } from "../api";

import "../stylesheets/NewPost.css";
const NewPost = ({token, loadingTrigger, setLoadingTrigger}) => {
    const [text, setText] = useState('')
    const [visibility, setVisibility] = useState("friends")

    const checkIsPublic = () => visibility === 'public'

    const handleSubmit = async(event) => {
        event.preventDefault();
        await newPost(token, text, new Date(), checkIsPublic())
        setLoadingTrigger(!loadingTrigger)
    }
    const handleVisibility = (newVis) => {
        setVisibility(newVis)
    }

    return (
      <div id="newsfeed-upper-wrapper">
        <div id='new-post-wrapper'>
          <div id="newPostBox">
              <form id='new-post-form' onSubmit={(event) => {handleSubmit(event)}}>
                  <textarea id="newPostTextBox" type='text' placeholder="What's on your mind?" value={text} onChange={(event) => setText(event.target.value)}/>
                  <div id="newPostBottomBar">
                      <label id="post-visibility-text">Visibility: </label>
                      <select
                          id="post-visibility-selector"
                          // value={visibility}
                          onChange={(event) => {handleVisibility(event.target.value)}}>
                              <option value='friends'>Friends Only</option>
                              <option value='public'>Public</option>
                      </select>
                      <button type="submit" id="post-button">Post!</button>
                  </div>
              </form>
          </div>
        </div>
        <div id="spacer-div"></div>
      </div>
    )
}

export default NewPost;