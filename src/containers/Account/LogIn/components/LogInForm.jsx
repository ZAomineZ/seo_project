/* eslint-disable */
import React, {PureComponent} from 'react';
import {Field, reduxForm} from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
import validate from '../../../../containers/Form/FormValidation/components/validate';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import renderCheckBoxField from '../../../../shared/components/form/CheckBox';
import axios from "axios";
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../../../shared/components/Notification";


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

const renderField = ({
                         input, placeholder, type, meta: {touched, error},
                     }) => (
    <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
        <input {...input} placeholder={placeholder} type={type}/>
        {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
);

renderField.propTypes = {
    input: PropTypes.shape().isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.string,
    }),
};

renderField.defaultProps = {
    placeholder: '',
    meta: null,
    type: 'text',
};

class LogInForm extends PureComponent {
    static propTypes = {
        handleSubmit: PropTypes.func,
        typeFuncSubmit: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            valueUsername: '',
            valuePassword: '',
            redirectRegister: false,
            rememberMe: true
        };

        this.showPassword = this.showPassword.bind(this);
        this.ChangeUsername = this.ChangeUsername.bind(this);
        this.ChangePassword = this.ChangePassword.bind(this);
        this.ChangeRemember_me = this.ChangeRemember_me.bind(this);
    }

    showPassword(e) {
        e.preventDefault();
        this.setState({
            showPassword: !this.state.showPassword,
            UserConnect: false
        });
    }

    RegisterPage (e)
    {
        e.preventDefault();
        this.setState({ redirectRegister: !this.state.redirectRegister })
    }

    SetCookie (name_cookie, value_cookie, expire_days)
    {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    CookieLogIn (session_remember_me, auth_user)
    {
        auth_user = JSON.parse(auth_user);
        if (session_remember_me === 'TRUE') {
            return this.SetCookie('remember_me_auth', auth_user.token_user + '__' + auth_user.id, 30)
        } else {
            return this.SetCookie('auth_today', auth_user.token_user + '__' + auth_user.id, 1)
        }
    }

    ArrayAuth (json)
    {
        json = JSON.parse(json);
        return JSON.stringify({
                'id': json.id,
                'username': json.username,
                'email': json.email
            })
    }

    SubmitLogIn(e)
    {
        e.preventDefault();
        if (this.state.valueUsername !== '' && this.state.valuePassword !== '') {
            if (this.state.valueUsername.length >= 5 && this.state.valuePassword.length >= 5) {
                let route = '/ReactProject/App'
                axios.get('http://' + window.location.hostname + route + '/Ajax/Auth/login.php', {
                    params: {
                        'username': this.state.valueUsername,
                        'password': this.state.valuePassword
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
                    if (response && response.status === 200)  {
                        if (!response.data.error) {
                            sessionStorage.setItem('Auth', this.ArrayAuth(JSON.stringify(response.data)));
                            sessionStorage.setItem('Remember_me', this.state.rememberMe ? 'TRUE' : 'FALSE');
                            this.CookieLogIn(sessionStorage.getItem('Remember_me'), JSON.stringify(response.data));
                            this.setState({ UserConnect: !this.state.UserConnect });
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification('You are connected !!!', 'success'), 700);
                        } else {
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                        }
                    }
                })
            }
        }
    }

    ChangeUsername (e)
    {
        this.setState({valueUsername: e.target.value})
    }

    ChangePassword (e)
    {
        this.setState({valuePassword: e.target.value})
    }

    ChangeRemember_me (e)
    {
        this.setState({ rememberMe: !this.state.rememberMe })
    }

    render() {
        const {handleSubmit, typeFuncSubmit} = this.props;

        if (this.state.redirectRegister) {
            return (
                <Redirect to={{
                    pathname: '/register',
                }}/>
            )
        } else if (this.state.UserConnect) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp',
                }}/>
            )
        }
        return (
            <form className="form" onSubmit={typeFuncSubmit === false ? e => this.SubmitLogIn(e) : handleSubmit}>
                <div className="form__form-group">
                    <span className="form__form-group-label">Username</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-icon">
                            <AccountOutlineIcon/>
                        </div>
                        <Field
                            name="username"
                            component={renderField}
                            type="text"
                            placeholder="Name"
                            onChange={this.ChangeUsername}
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">Password</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-icon">
                            <KeyVariantIcon/>
                        </div>
                        <Field
                            name="password"
                            component={renderField}
                            type={this.state.showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            onChange={this.ChangePassword}
                        />
                        <button
                            className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                            onClick={e => this.showPassword(e)}
                        ><EyeIcon/>
                        </button>
                    </div>
                    <div className="account__forgot-password">
                        <a href="/password_forgot">Forgot a password?</a>
                    </div>
                </div>
                <div className="form__form-group">
                    <div className="form__form-group-field">
                        <Field
                            name="remember_me"
                            component={renderCheckBoxField}
                            label="Remember me"
                            onChange={this.ChangeRemember_me}
                        />
                    </div>
                </div>
                <div className="account_style">
                    <button className="btn btn-primary account__btn">Sign In</button>
                    <button className="btn btn-outline-primary account__btn" onClick={e => this.RegisterPage(e)}>Create
                        Account
                    </button>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'log_in_form', // a unique identifier for this form
    validate
})(LogInForm);
