/* eslint-disable */
import React, {PureComponent} from 'react';
import LogInForm from './components/LogInForm';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../../shared/components/Notification";
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

class LogIn extends PureComponent {
    constructor () {
      super();
      this.state = {
         auth : ''
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

    componentDidMount() {
        if (sessionStorage.getItem('Auth') && this.getCookie('auth_day') !== '') {
            this.setState({ auth : 'Auth' });
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('You are already connected, it is impossible to access this page !!!', 'danger'), 700);
        } else {
            if (sessionStorage.getItem('Auth')) {
                sessionStorage.removeItem('Auth');
                sessionStorage.removeItem('Remember_me');
            }
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
            <div className="account">
                <div className="account__wrapper">
                    <div className="account__card">
                        <div className="account__head">
                            <h3 className="account__title">Welcome to
                                <span className="account__logo"> Machin
              <span className="account__logo-accent">ools</span>
            </span>
                            </h3>
                            <h4 className="account__subhead subhead">Start your SEO easily</h4>
                        </div>
                        <LogInForm typeFuncSubmit={false} />
                    </div>
                </div>
            </div>
        );
    }
}

export default LogIn;
