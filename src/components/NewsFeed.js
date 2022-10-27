import React, {useEffect, useState} from 'react';
import { getAllPublicPosts } from '../api';
import NewPost from './NewPost';
import SinglePost from './SinglePost';


const NewsFeed = ({token}) => {
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [allPublic, setAllPublic] = useState([]);

    useEffect(() => {
        fetchPosts();
    },[])

    const fetchPosts = async() => {
        const newPostsArr = [];
        const getPublicPosts = await getAllPublicPosts();
        //const getFriendPosts
        getPublicPosts[0] && newPostsArr.push(...getPublicPosts);
        setAllPublic(newPostsArr);
    }

    return (
        <div>
            <div>Hi from the NewsFeed</div>
            <NewPost token={token}/>
            {allPublic[0] ? allPublic.map((post, i) => {
                return (
                    <SinglePost key= {i} post={post}/>
                )
            }):null}
        </div>
        //map all the loaded posts to the SinglePost component
        //post object comes back with a userID. what it needs is a authorname convered before the API sends it back.
    )
}
export default NewsFeed;