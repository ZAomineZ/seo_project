/* eslint-disable */
import React, {PureComponent} from 'react';
import EmailConfirmationCard from '../../containers/Account/EmailConfimation/components/EmailConfirmationCard';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
import {Redirect} from "react-router-dom";
import axios from "axios";
import {route, requestUri} from '../../const'

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

class EmailConfirmationRegister extends PureComponent {
    constructor() {
        super();
        this.state = {
            auth: ''
        }
    }

    getCookie(name_cookie) {
        let name = name_cookie + '=';
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let cook = cookie[i];
            while (cook.charAt(0) == ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) == 0) {
                return cook.substring(name.length, cook.length);
            }
            return '';
        }
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
        if (this.getCookie('remember_me_auth') !== '') {
            if (!sessionStorage.getItem('Auth')) {
                let split_string = this.getCookie('remember_me_auth').split('__');
                let id = split_string[1];
                if (id !== '') {
                    axios.get(requestUri + window.location.hostname + route + '/Ajax/Auth/ReconnectCookie.php', {
                        params: {
                            'id': id,
                            'cookie': this.getCookie('remember_me_auth')
                        },
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Content-Type': 'text/plain',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                            'Access-Control-Allow-Credentials': true,
                            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                            'Access-Control-Max-Age': 1728000,
                            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
                        },
                    }).then((response) => {
                        if (response && response.status === 200) {
                            if (response.data !== '') {
                                if (response.data.error && response.data.error === 'Invalid Token') {
                                    this.DeleteCookie('remember_me_auth')
                                    this.DeleteCookieNotExist();
                                    NotificationSystem.newInstance({}, n => notification = n);
                                    setTimeout(() => showNotification('Your account is used by another platform', 'danger'), 700);
                                } else {
                                    let JSON_DECODE = JSON.stringify(response.data);
                                    sessionStorage.setItem('Auth', JSON_DECODE);
                                    sessionStorage.setItem('Remember_me', 'TRUE');
                                    this.setState({ auth: 'Auth' });
                                    NotificationSystem.newInstance({}, n => notification = n);
                                    setTimeout(() => showNotification('You are connected !!!', 'success'), 700);
                                }
                            }
                        }
                    })
                }
            }
        } else {
            if (this.getCookie('auth_today') !== '') {
                if (!sessionStorage.getItem('Auth')) {
                    let split_string = this.getCookie('auth_today').split('__');
                    let id = split_string[1];
                    if (id !== '') {
                        axios.get(requestUri + window.location.hostname + route + '/Ajax/Auth/ReconnectCookie.php', {
                            params: {
                                'id': id,
                                'cookie': this.getCookie('auth_today')
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
                                if (response.data !== '') {
                                    if (response.data.error && response.data.error === 'Invalid Token') {
                                        this.DeleteCookie('auth_today')
                                        this.DeleteCookieNotExist();
                                        NotificationSystem.newInstance({}, n => notification = n);
                                        setTimeout(() => showNotification('Your account is used by another platform', 'danger'), 700);
                                    } else {
                                        let JSON_DECODE = JSON.stringify(response.data);
                                        sessionStorage.setItem('Auth', JSON_DECODE);
                                        sessionStorage.setItem('Remember_me', 'FALSE');
                                        this.setState({ auth: 'Auth' });
                                        NotificationSystem.newInstance({}, n => notification = n);
                                        setTimeout(() => showNotification('You are connected !!!', 'success'), 700);
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }
        if (sessionStorage.getItem('Auth')) {
            if (JSON.parse(sessionStorage.getItem('Auth')).confirmation_at === "1") {
                this.setState({ auth: 'Auth'});
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification('You are already connected and you dont have received new email !!!', 'danger'), 700);
            }
        }
    }

    DeleteCookieNotExist ()
    {
        sessionStorage.removeItem('Auth');
        sessionStorage.removeItem('Remember_me');
        this.setState({auth: 'noAuth'});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.getCookie('auth_today') === '' && this.getCookie('remember_me_auth') === '') {
            this.DeleteCookieNotExist()
        }
    }

    render() {
        if (this.state.auth === 'Auth')  {
            return (
                <Redirect to={{
                    pathname: '/seo/serp',
                }}/>
            );
        }
        return (
            <EmailConfirmationCard />
        );
    }
}

export default EmailConfirmationRegister;
