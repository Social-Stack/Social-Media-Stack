import React, {useEffect, useState} from 'react';
import { getAllPublicPosts } from '../api';


const NewsFeed = ({token}) => {
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [allPublic, setAllPublic] = useState([]);

    useEffect(async() => {
        const getPublicPosts = await getAllPublicPosts();
        setAllPublic(getPublicPosts);
    },[])



    return (
        <div>Hi from the NewsFeed</div>
        //map all the loaded posts to the SinglePost component
        //post object comes back with a userID. what it needs is a authorname convered before the API sends it back.
    )
}
export default NewsFeed;