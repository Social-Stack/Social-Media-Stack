import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyUserInfo } from '../api';
import '../stylesheets/NewsFeedLeftPanel.css';

export const NewsFeedLeftPanel = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    getThisUser();
  }, []);

  const getThisUser = async () => {
    const _user = await getMyUserInfo(token);
    console.log(_user);
    setUser(_user);
  };

  const handleNavigate = itemUrl => {
    navigate(itemUrl);
  };

  return (
    <div id='left-panel-container'>
      <h3 id='lp-title'>Links</h3>
      <div id='lp-links-wrapper'>
        <div
          id='lp-current-user-wrapper'
          className='lp-link-item'
          onClick={handleNavigate.bind(null, `/profile/${user.username}`)}
        >
          <img src={user.picUrl} id='lp-cu-profilepic' className='lp-images' />
          <span id='lp-cu-name' className='lp-item-text'>
            {user.firstname} {user.lastname}
          </span>
        </div>
        <div
          id='lp-friends-wrapper'
          className='lp-link-item'
          onClick={handleNavigate.bind(null, `/friendslists/${user.username}`)}
        >
          <img
            src='https://i.ibb.co/Gd357zW/friends-icon-edited.png'
            id='lp-friends-img'
            className='lp-images'
          />
          <span id='lp-friends-text' className='lp-item-text'>
            Friends
          </span>
        </div>
        <div id='lp-groups-wrapper' className='lp-link-item'>
          <img
            src='https://i.ibb.co/q7tYgPT/group-icon-red.png'
            id='lp-group-img'
            className='lp-images'
          />
          <span id='lp-groups-text' className='lp-item-text'>
            Groups
          </span>
        </div>
        <div
          id='lp-algo-expert-wrapper'
          className='lp-link-item'
          onClick={() => window.open('https://www.algoexpert.io', '_blank')}
        >
          <img
            src='https://i.ibb.co/S58kd5w/algoexpert-icon-edited.png'
            id='lp-ae-img'
            className='lp-images'
          />
          <span id='lp-ae-text' className='lp-item-text'>
            AlgoExpert
          </span>
        </div>
        <div
          id='lp-freecodecamp-wrapper'
          className='lp-link-item'
          onClick={() => window.open('https://www.freecodecamp.org', '_blank')}
        >
          <img
            src='https://i.ibb.co/MhRDsTs/fcc-secondary-small.png'
            id='lp-fcc-img'
            className='lp-images'
          />
          <span id='lp-fcc-text' className='lp-item-text'>
            freeCodeCamp
          </span>
        </div>
      </div>
    </div>
  );
};
