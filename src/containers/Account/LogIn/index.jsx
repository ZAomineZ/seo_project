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

    componentDidMount() {
        if (sessionStorage.getItem('Auth')) {
            this.setState({ auth : 'Auth' });
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('You are already connected, it is impossible to access this page !!!', 'danger'), 700);
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
                                <span className="account__logo"> Easy
              <span className="account__logo-accent">DEV</span>
            </span>
                            </h3>
                            <h4 className="account__subhead subhead">Start your business easily</h4>
                        </div>
                        <LogInForm typeFuncSubmit={false} />
                    </div>
                </div>
            </div>
        );
    }
}

export default LogIn;
