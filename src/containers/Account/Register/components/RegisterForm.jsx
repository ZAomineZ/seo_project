/* eslint-disable */
import React, {PureComponent} from 'react';
import {Field, reduxForm} from 'redux-form';
import validate from '../../../../containers/Form/FormValidation/components/validate';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import MailRuIcon from 'mdi-react/MailRuIcon';
import PropTypes from 'prop-types';
import axios from "axios";
import {route} from '../../../../const'
import {BasicNotification} from "../../../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import {Redirect} from "react-router-dom";
import renderRadioButtonField from '../../../../shared/components/form/RadioButton';

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

let notification = null;

const showNotification = (message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={type === 'danger' ? '👋 A Error is present !!!' : '👋 Success Message !!!'}
            message={type === 'danger' ? message.error : message.success + ', You can check your account via your email !!!'}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class RegisterForm extends PureComponent {
    static propTypes = {
        handleSubmit: PropTypes.func,
        typeFuncSubmit: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            valueUsername: '',
            valueEmail: '',
            valuePassword: '',
            valueGender: '',
            message: '',
            emailReceived: false
        };

        this.showPassword = this.showPassword.bind(this);
        this.OnChangeUser = this.OnChangeUser.bind(this);
        this.OnChangeEmail = this.OnChangeEmail.bind(this);
        this.OnChangePassword = this.OnChangePassword.bind(this);
        this.OnChangeGender = this.OnChangeGender.bind(this);
    }

    showPassword(e) {
        e.preventDefault();
        this.setState({
            showPassword: !this.state.showPassword,
        });
    }

    SubmitRegister(event) {
        event.preventDefault();
        if (this.state.valueUsername !== '' && this.state.valueEmail !== '' && this.state.valuePassword !== '' && this.state.valueGender !== '') {
            if (this.state.valueUsername.length >= 5 && this.state.valuePassword.length >= 5 && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.valueEmail)) {
                axios.get('http://' + window.location.hostname + route + '/Ajax/Auth/register.php', {
                    params: {
                        'username': this.state.valueUsername,
                        'email': this.state.valueEmail,
                        'password': this.state.valuePassword,
                        'gender': this.state.valueGender
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
                }).then(response => {
                    if (response && response.status === 200) {
                        this.setState({
                            message: response.data,
                            emailReceived: response.data.success ? !this.state.emailReceived : false
                        });
                        NotificationSystem.newInstance({}, n => notification = n);
                        if (response.data.username || response.data.email) {
                            setTimeout(() => showNotification(response.data.username ? response.data.username : response.data.email ? response.data.email : '', 'danger'), 700);
                        } else {
                            setTimeout(() => showNotification(this.state.message, response.data.error ? 'danger' : 'success'), 700);
                        }
                    }
                })
            }
        }
    }

    OnChangeUser(e) {
        this.setState({valueUsername: e.target.value})
    }

    OnChangeEmail(e) {
        this.setState({valueEmail: e.target.value})
    }

    OnChangePassword(e) {
        this.setState({valuePassword: e.target.value})
    }

    OnChangeGender(e) {
        this.setState({valueGender: e[0]});
    }

    render() {
        const {handleSubmit, typeFuncSubmit} = this.props;

        if (this.state.emailReceived) {
            return (
                <Redirect to={{
                    pathname: '/confirmation_email',
                }}/>
            )
        }
        return (
            <form className="form" onSubmit={typeFuncSubmit === false ? e => this.SubmitRegister(e) : handleSubmit}>
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
                            placeholder="Your Username..."
                            onChange={this.OnChangeUser}
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">E-mail</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-icon">
                            <MailRuIcon/>
                        </div>
                        <Field
                            name="email"
                            component={renderField}
                            type="email"
                            placeholder="example@mail.com"
                            onChange={this.OnChangeEmail}
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">Gender</span>
                    <div className="form__form-group-field">
                        <Field
                            name="gender"
                            component={renderRadioButtonField}
                            label="Male"
                            radioValue="M"
                            defaultChecked
                            onChange={this.OnChangeGender}
                        />
                        <Field
                            name="gender"
                            component={renderRadioButtonField}
                            label="Female"
                            radioValue="F"
                            onChange={this.OnChangeGender}
                        />
                    </div>
                </div>
                <div className="form__form-group form__form-group--forgot">
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
                            onChange={this.OnChangePassword}
                        />
                        <button
                            className={`form__form-group-button${this.state.showPassword ? ' active' : ''}`}
                            onClick={e => this.showPassword(e)}
                        ><EyeIcon/>
                        </button>
                    </div>
                </div>
                <div className="account__btns">
                    <button className="btn btn-primary account__btn">Sign Up</button>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'register_form', // a unique identifier for this form
    validate,
})(RegisterForm);
