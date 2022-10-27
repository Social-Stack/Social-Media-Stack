import React, {useEffect, useState} from 'react';
import { getAllPublicPosts } from '../api';


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
        newPostsArr.push(getPublicPosts);
        setAllPublic(newPostsArr);
    }



    return (
        <div>Hi from the NewsFeed</div>
        //map all the loaded posts to the SinglePost component
        //post object comes back with a userID. what it needs is a authorname convered before the API sends it back.
    )
}
export default NewsFeed;