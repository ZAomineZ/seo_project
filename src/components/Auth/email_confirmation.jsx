/* eslint-disable */
import React, {PureComponent} from 'react';
import EmailConfirmationCard from '../../containers/Account/EmailConfimation/components/EmailConfirmationCard';
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

class EmailConfirmationRegister extends PureComponent {
    constructor() {
        super();
        this.state = {
            auth: ''
        }
    }

    componentDidMount() {
        if (sessionStorage.getItem('Auth')) {
            if (JSON.parse(sessionStorage.getItem('Auth')).confirmation_at === "1") {
                this.setState({ auth: 'Auth'});
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification('You are already connected and you dont have received new email !!!', 'danger'), 700);
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
            <EmailConfirmationCard />
        );
    }
}

export default EmailConfirmationRegister;
