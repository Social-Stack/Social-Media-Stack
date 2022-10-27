import React, {useState} from "react";
import { newPost } from "../api";

const NewPost = ({token, loadingTrigger, setLoadingTrigger}) => {

    //component to send newPost to the API
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

    const tempStyle={
        border:'solid',
        borderRadius:'5px',
        borderWidth:'1px',
        width:'500px',
        margin:'2px0'
    }
    const tempTextStyle={
        minWidth:'480px',
        maxWidth:'480px',
        
    }
    return (
        <div style={tempStyle}>
            <form onSubmit={(event) => {handleSubmit(event)}}>
                <textarea style={tempTextStyle} placeholder="What's on your mind?" value={text} onChange={(event) => setText(event.target.value)}></textarea>
                <label>Visibility: </label>
                <select
                    value={visibility}
                    onChange={(event) => {handleVisibility(event.target.value)}}>
                        <option value='friends'>Friends Only</option>
                        <option value='public'>Public</option>
                </select>
                <button type="submit">Post!</button>
            </form>

        </div>
    )
}

export default NewPost;