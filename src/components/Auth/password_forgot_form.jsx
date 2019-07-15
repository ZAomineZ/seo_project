/* eslint-disable */
import React, {PureComponent} from 'react';
import {Field, reduxForm} from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
import validate from '../../containers/Form/FormValidation/components/validate';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import PropTypes from 'prop-types';
import renderCheckBoxField from '../../shared/components/form/CheckBox';
import {BasicNotification} from "../../shared/components/Notification";
import MailRuIcon from "mdi-react/MailRuIcon";
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
        typeFuncSubmit: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            valueEmail: '',
            redirectLogIn: false,
            emailReceived: false
        };

        this.ChangeEmail = this.ChangeEmail.bind(this);
    }

    LogInPage (e)
    {
        e.preventDefault();
        this.setState({ redirectLogIn: !this.state.redirectLogIn })
    }

    SubmitPasswordFagot (e)
    {
        e.preventDefault();
        if (this.state.valueEmail !== '' && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.valueEmail)) {
            let route = '/ReactProject/App'
            axios.get('http://' + window.location.hostname + route + '/Ajax/Auth/password_forgot.php', {
                params: {
                    'email': this.state.valueEmail,
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
                    if (response.data && response.data.success) {
                        this.setState({ emailReceived: !this.state.emailReceived });
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

    ChangeEmail (e)
    {
        this.setState({valueEmail: e.target.value})
    }

    render() {
        const {handleSubmit, typeFuncSubmit} = this.props;

        if (this.state.redirectLogIn) {
            return (
                <Redirect to={{
                    pathname: '/log_in',
                }}/>
            )
        } else if (this.state.emailReceived) {
            return (
                <Redirect to={{
                    pathname: '/confirmation_email',
                }}/>
            )
        }

        return (
            <form className="form" onSubmit={typeFuncSubmit === false ? e => this.SubmitPasswordFagot(e) : handleSubmit}>
                <div className="form__form-group">
                    <span className="form__form-group-label">Email</span>
                    <div className="form__form-group-field">
                        <div className="form__form-group-icon">
                            <MailRuIcon/>
                        </div>
                        <Field
                            name="email"
                            component={renderField}
                            type="email"
                            placeholder="Your email ..."
                            onChange={this.ChangeEmail}
                        />
                    </div>
                </div>
                <div className="account_fagot">
                    <button className="btn btn-primary account__btn">Submit</button>
                    <button className="btn btn-outline-primary account__btn" onClick={e => this.LogInPage(e)}> Sign In
                    </button>
                </div>
            </form>
        );
    }
}

export default reduxForm({
    form: 'log_in_form', // a unique identifier for this form
    validate
})(PasswordFagotForm);
