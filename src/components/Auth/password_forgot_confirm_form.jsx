/* eslint-disable */
import React, {PureComponent} from 'react';
import {Field, reduxForm} from 'redux-form';
import validate from '../../containers/Form/FormValidation/components/validate';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import PropTypes from 'prop-types';
import {BasicNotification} from "../../shared/components/Notification";
import {Redirect} from "react-router-dom";
import axios from "axios";
import NotificationSystem from "rc-notification";


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

class PasswordFagotForm extends PureComponent {
    static propTypes = {
        handleSubmit: PropTypes.func,
        typeFuncSubmit: PropTypes.bool.isRequired,
        token: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            valuePassword: '',
            valuePasswordConfirm: '',
            redirectLogin: false
        };
        this.ChangePassword = this.ChangePassword.bind(this);
        this.ChangePasswordConfirm = this.ChangePasswordConfirm.bind(this);
    }

    SubmitPasswordForgetConfirm (e)
    {
        e.preventDefault();
        if (this.state.valuePassword !== '' && this.state.valuePasswordConfirm !== '' && this.state.valuePassword.length >= 5 && this.state.valuePasswordConfirm.length >= 5) {
            if (this.state.valuePassword === this.state.valuePasswordConfirm) {
                axios.get('http://localhost/ReactProject/App/Ajax/Auth/password_forgot_confirm.php', {
                    params: {
                        'token': this.props.token,
                        'password': this.state.valuePassword,
                        'password_confirm': this.state.valuePasswordConfirm
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((response) => {
                    if (response && response.status === 200) {
                        if (response.data.success) {
                            this.setState({ redirectLogin: !this.state.redirectLogin });
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification(response.data.success, 'success'), 700);
                        } else {
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                        }
                    }
                })
            }
        }
    }

    ChangePassword (e)
    {
        this.setState({valuePassword: e.target.value})
    }

    ChangePasswordConfirm (e)
    {
        this.setState({ valuePasswordConfirm: e.target.value })
    }

    render() {
        const {handleSubmit, typeFuncSubmit} = this.props;

        if (this.state.redirectLogin) {
            return (
                <Redirect to={{
                    pathname: '/log_in',
                }}/>
            )
        }

        return (
            <form className="form" onSubmit={typeFuncSubmit === false ? e => this.SubmitPasswordForgetConfirm(e) : handleSubmit}>
                <div className="form__form-group">
                    <span className="form__form-group-label">New Password</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-icon">
                            <KeyVariantIcon/>
                        </div>
                        <Field
                            name="new_password"
                            component={renderField}
                            type="password"
                            placeholder="Your new Password ..."
                            onChange={this.ChangePassword}
                        />
                    </div>
                </div>
                <div className="form__form-group">
                    <span className="form__form-group-label">New Password Confirm</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-icon">
                            <KeyVariantIcon/>
                        </div>
                        <Field
                            name="new_password_confirm"
                            component={renderField}
                            type="password"
                            placeholder="Confirmation your new password ..."
                            onChange={this.ChangePasswordConfirm}
                        />
                    </div>
                </div>
                <div className="account_fagot">
                    <button className="btn btn-primary account__btn">Submit</button>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'log_in_form', // a unique identifier for this form
    validate
})(PasswordFagotForm);
