/* eslint-disable */
import React, {PureComponent} from 'react';
import {Link, Redirect} from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../../shared/components/Notification";

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
