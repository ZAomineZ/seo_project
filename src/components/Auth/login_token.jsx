/* eslint-disable */
import React, {PureComponent} from 'react';
import axios from "axios";
import {route, requestUri} from '../../const'
import {Redirect} from "react-router-dom";
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";

let notification = null;

const showNotification = (message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title='👋 Danger !!!'
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

export default class LoginToken extends PureComponent {
    constructor() {
        super();
        this.state = {
            auth: ''
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem('Auth')) {
            this.setState({auth: 'Auth'});
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('You are already connected, it is impossible to access this page !!!', 'danger'), 700);
        }
        axios.get(requestUri + window.location.hostname + route + '/Ajax/Auth/login_token.php', {
            params: {
                'token': this.props.match.params.token
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                'Access-Control-Max-Age': 1728000,
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
            },
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data === 1) {
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification('Your account has been confirmed !!!', 'success'), 700);
                } else {
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification('Your account has already been confirmed or this token is incorrect !!!', 'danger'), 700);
                }
            }
        })
    }

    render() {
        if (this.state.auth === 'Auth')  {
            return (
                <Redirect to={{
                    pathname: '/seo/serp',
                }}/>
            );
        }
        return <Redirect to={{
            pathname: '/log_in',
        }}/>;
    }
}
