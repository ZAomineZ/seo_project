/* eslint-disable */
import React, {PureComponent} from 'react';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
import {Redirect} from "react-router-dom";

let notification = null;

const showNotification = (message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={type === 'danger' ? '👋 A Error is present !!!' : '👋 Well done !!!'}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

export default class LogOut extends PureComponent {
    constructor() {
        super();
    }

    SetCookie (name_cookie, value_cookie, expire_days)
    {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    DeleteCookie (name_cookie)
    {
        return this.SetCookie(name_cookie, '', -1);
    }

    componentDidMount() {
        if (sessionStorage.getItem('Auth')) {
            sessionStorage.removeItem('Auth');
            sessionStorage.removeItem('Remember_me');
            this.DeleteCookie('remember_me_auth');
            this.DeleteCookie('auth_today');
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('You are logout !!!', 'danger'), 700);
        } else {
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('You must be logged in to access this page !!!', 'danger'), 700);
        }
    }

    render() {
        return (
            <Redirect to={{
                pathname: '/log_in',
            }}/>
        );
    }
}
