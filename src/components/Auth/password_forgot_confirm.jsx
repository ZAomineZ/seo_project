/* eslint-disable */
import React, {PureComponent} from 'react';
import PasswordForgotConfirmForm from './password_forgot_confirm_form'
import axios from "axios";
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

class PasswordForgotConfirm extends PureComponent {
    constructor() {
        super();
        this.state = {
            redirectLogIn: false
        }
    }

    componentDidMount() {
        let route = '/ReactProject/App';
        axios.get('http://' + window.location.hostname + route + '/Ajax/Auth/password_forgot_confirm_error.php', {
            params: {
                'token': this.props.match.params.token,
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
                if (response.data.error) {
                    this.setState({ redirectLogIn: !this.state.redirectLogIn });
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                }
            }
        })
    }

    render() {
        if (this.state.redirectLogIn) {
            return (
                <Redirect to={{
                    pathname: '/log_in',
                }}/>
            )
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
                            <h4 className="account__subhead subhead">Fomulate your new Password !!!</h4>
                        </div>
                        <PasswordForgotConfirmForm typeFuncSubmit={false} token={this.props.match.params.token} />
                    </div>
                </div>
            </div>
        );
    }
}

export default PasswordForgotConfirm
