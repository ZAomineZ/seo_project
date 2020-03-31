/* eslint-disable */

import React from "react";
import {BasicNotification} from "../shared/components/Notification";
import NotificationSystem from "rc-notification";

let notification = null;

const showNotification = (title, message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={title}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

export default class NotificationMessage
{
    /**
     * @param {string} message
     * @param {string} title
     * @param {string} type
     */
    static notification(message, title, type) {
        NotificationSystem.newInstance({}, n => notification = n);
        setTimeout(() => showNotification(title, message, type), 700);
    }

    static destroy = () => notification.destroy();
}
