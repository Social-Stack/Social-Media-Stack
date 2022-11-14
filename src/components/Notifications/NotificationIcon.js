import React, {useEffect, useState} from "react";
import { getUnseenNotifications } from "../../api";

const NotificationIcon = ({token}) => {
    const [unseen, setUnseen ] = useState([]);

    const getUnseen = async () => {
        if(token){
        const notis = await getUnseenNotifications(token);
        setUnseen(notis);
        }
    }

    useEffect(() => {
        setInterval(getUnseen,10000);
    },[token])

    return (
        <>{unseen.length} Bell</>
    )
}
export default NotificationIcon