/* eslint-disable */
import React, {PureComponent} from 'react';
import {Link, Redirect} from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../../shared/components/Notification";
import axios from "axios";
import {route, requestUri} from '../../../const'

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

class Register extends PureComponent {
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
            let cook = cookie[i].trimStart();
            while (cook.charAt(0) == ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) == 0) {
                return cook.substring(name.length, cook.length);
            }
        }
    }

    SetCookie(name_cookie, value_cookie, expire_days) {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    DeleteCookie(name_cookie) {
        return this.SetCookie(name_cookie, '', -1);
    }

    componentDidMount() {
        if (this.getCookie('remember_me_auth') !== undefined) {
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
                            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
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
                                    this.setState({auth: 'Auth'});
                                    NotificationSystem.newInstance({}, n => notification = n);
                                    setTimeout(() => showNotification('You are connected !!!', 'success'), 700);
                                }
                            }
                        }
                    })
                }
            }
        } else {
            if (this.getCookie('auth_today') !== undefined) {
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
                                        this.DeleteCookie('auth_today');
                                        this.DeleteCookieNotExist();
                                        NotificationSystem.newInstance({}, n => notification = n);
                                        setTimeout(() => showNotification('Your account is used by another platform', 'danger'), 700);
                                    } else {
                                        let JSON_DECODE = JSON.stringify(response.data);
                                        sessionStorage.setItem('Auth', JSON_DECODE);
                                        sessionStorage.setItem('Remember_me', 'FALSE');
                                        this.setState({auth: 'Auth'});
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
            this.setState({auth: 'Auth'});
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('You are already connected, it is impossible to access this page !!!', 'danger'), 700);
        }
    }

    DeleteCookieNotExist() {
        sessionStorage.removeItem('Auth');
        sessionStorage.removeItem('Remember_me');
        this.setState({auth: 'noAuth'});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.getCookie('auth_today') === undefined && this.getCookie('remember_me_auth') === undefined) {
            this.DeleteCookieNotExist()
        }
    }

    render() {
        if (this.state.auth === 'Auth') {
            return (
                <Redirect to={{
                    pathname: '/seo/serp',
                }}/>
            );
        }
        return (
            <div className="account">
                <div className="account__wrapper">
                    <div className="account__card">
                        <div className="account__head">
                            <h3 className="account__title">Welcome to
                                <span className="account__logo"> Machin
              <span className="account__logo-accent">Ools</span>
            </span>
                            </h3>
                            <h4 className="account__subhead subhead">Create an account</h4>
                        </div>
                        <RegisterForm typeFuncSubmit={false}/>
                        <div className="account__have-account">
                            <p>Already have an account? <Link to="/log_in">Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
