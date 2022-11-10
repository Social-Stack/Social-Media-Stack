import React, { useEffect, useState } from "react";
import { getAllMyNotifications } from "../api";
import NotificationSingleItem from "./NotificationSingleItem";


const NotificationPage = ({token}) => {
    const [notifications, setNotifications] = useState([]);


    const fetchNotifications = async() => {
        const notis = await getAllMyNotifications(token);
        console.log('setting notifications', notis)
        setNotifications(notis);
    }

    useEffect(() => {
        fetchNotifications();
    },[])

    return (
        <div>
            <h4>Notifications</h4>
            {notifications.length ? 
            notifications.map((notification) => {
                return (
                    <NotificationSingleItem
                    key={notification.id}
                    notification={notification}/>
                )
            })
            : <> no notifications</>
            }
        </div>
    )
}
export default NotificationPage