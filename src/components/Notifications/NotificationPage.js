import React, { useEffect, useState } from "react";
import { getAllMyNotifications } from "../../api";
import NotificationItemHandler from "./NotificationItemHandler";


const NotificationPage = ({token}) => {
    const [notifications, setNotifications] = useState([]);
    const [notiTrigger, setNotiTrigger] = useState(false);


    const fetchNotifications = async() => {
        const notis = await getAllMyNotifications(token);
        console.log('setting notifications', notis)
        setNotifications(notis);
    }

    useEffect(() => {
        fetchNotifications();
    },[notiTrigger])

    return (
        <div>
            <h4>Notifications</h4>
            {notifications.length ? 
            notifications.map((notification) => {
                return (
                    <NotificationItemHandler
                    setNotiTrigger={setNotiTrigger}
                    notiTrigger={notiTrigger}
                    key={notification.id}
                    token={token}
                    notification={notification}/>
                )
            })
            : <> no notifications</>
            }
        </div>
    )
}
export default NotificationPage