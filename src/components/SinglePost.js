import React,{useEffect, useState} from "react";


const SinglePost = ({post}) => {
    const [time, setTime] = useState("Just now");
    

    const assignTime = () => {
        console.log('current', new Date())
        console.log('post time', post.time)
    }

    useEffect(() => {
        assignTime();
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
                    <div>{time}</div>
                </div>
            </div>
            <div>{post.text}</div>
        </div>
    )
}
export default SinglePost;