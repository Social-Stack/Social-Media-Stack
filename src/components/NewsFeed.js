import React, {useEffect, useState} from 'react';
import { getAllPublicPosts } from '../api';
import NewPost from './NewPost';
import SinglePost from './SinglePost';


const NewsFeed = ({token}) => {
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [allPublic, setAllPublic] = useState([]);
    const [loadingTrigger, setLoadingTrigger] = useState(true);

    useEffect(() => {
        fetchPosts();
    },[loadingTrigger])

    const fetchPosts = async() => {
        const newPostsArr = [];
        const getPublicPosts = await getAllPublicPosts();
        //const getFriendPosts
        getPublicPosts[0] && newPostsArr.push(...getPublicPosts);
        console.log(newPostsArr)
        setAllPublic(newPostsArr);
    }

    return (
        <div>
            <NewPost
            token={token}
            loadingTrigger={loadingTrigger}
            setLoadingTrigger={setLoadingTrigger}/>
            {allPublic[0] ? allPublic.map((post, i) => {
                return (
                    <SinglePost
                    key= {i}
                    post={post}/>
                )
            }):null}
        </div>
        //post object comes back with a userID. what it needs is a authorname convered before the API sends it back.
    )
}
export default NewsFeed;