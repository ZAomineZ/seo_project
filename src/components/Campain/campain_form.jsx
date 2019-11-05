/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import validate from '../../containers/Form/FormValidation/components/validate';
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import axios from "axios";
import {requestUri, route} from '../../const'

const renderField = ({
                         input, placeholder, type, meta: { touched, error },
                     }) => (
    <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
        <input {...input} placeholder={placeholder} type={type} />
        {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
);

let notification = null;

const showNotification = (error, message) => {
    notification.notice({
        content: <BasicNotification
            color="danger"
            title={error}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: { top: 0, left: 'calc(100vw - 100%)' },
        className: 'left-up',
    });
};

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

class CampainForm extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
        location: PropTypes.string.isRequired,
    };

    constructor() {
        super();
        this.state = {
            showPassword: false,
            valueInput: '',
            redirectTo: false,
        };
        this.onChangeInput = this.onChangeInput.bind(this);
    }

    SetCookie (name_cookie, value_cookie, expire_days)
    {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
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

    CookieReset (token, id)
    {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({ redirectSerp : !this.state.redirectSerp})
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.state.valueInput.length !== 0) {
            if (this.state.valueInput.indexOf('/') === -1 && this.state.valueInput.indexOf('.') === -1) {
                if (/^[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF' ]*$/i.test(this.state.valueInput)) {
                    const value = this.state.valueInput;
                    axios.get(requestUri + window.location.hostname + route + "/Ajax/Campain/Campain.php", {
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
                        params: {
                            'campain': value,
                            'auth': sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '',
                            'cookie': this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today')
                        }
                    }).then((response) => {
                        if (response && response.status === 200) {
                            if (response.data.error) {
                                if (response.data.error === 'Invalid Token') {
                                    this.CookieReset(response.data.token, response.data.id)
                                } else {
                                    NotificationSystem.newInstance({}, n => notification = n);
                                    setTimeout(() => showNotification('A Error is present !!!', response.data.error), 700);
                                }
                            } else {
                                this.setState({ redirectTo: !this.state.redirectTo })
                            }
                        }
                    })
                } else {
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification('A Error is present !!!', 'Your Field is invalid !!!'), 700);
                }
            } else {
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification('A Error is present !!!', 'Your campain is invalid !!!'), 700);
            }
        }
    }

    onChangeInput(e) {
        this.setState({ valueInput: e.target.value });
    }

    render() {
        const { t, location } = this.props;
        const redirectMe = this.state.redirectTo;
        let value_end = '';
        if (this.state.valueInput.indexOf(' ')) {
            let mot = this.state.valueInput.split(' ');
            let mot_array = mot.map((val) => {
                return val
            });
            let mot_end = '';
            for (let i = 0; i < mot_array.length; i++) {
                mot_end += mot_array[i] + '-'
            }
            let value = mot_end.lastIndexOf('-')
            value_end += mot_end.substring(0, value)
        }
        let Slugify = require('slugifyjs').fromLocale('en');
        if (redirectMe) {
                return (
                    <Redirect to={{
                        pathname: 'campain/' + Slugify.parse(value_end),
                    }}/>
                );
        }
        if (location.substr(-1) === '/') {
            return <Redirect to={location.substr(0, location.length - 1)} />;
        }
        return (
            <Col md={12} lg={12}>
                <Card>
                    <CardBody>
                        <div className="card__title">
                            <h5 className="bold-text">{t('Add campaign')}</h5>
                            <h5 className="subhead">Write your campaign !!!</h5>
                        </div>
                        <form className="form form--horizontal" onSubmit={e => this.onSubmit(e)}>
                            <div className="form__form-group">
                                <span className="form__form-group-label">Campaign</span>
                                <div className="form__form-group-field">
                                    <Field
                                        name="text"
                                        component={renderField}
                                        type="text"
                                        placeholder="Your campaign..."
                                        onChange={this.onChangeInput}
                                    />
                                </div>
                            </div>
                            <ButtonToolbar className="form__button-toolbar">
                                <Button color="primary" type="submit">Submit</Button>
                            </ButtonToolbar>
                        </form>
                    </CardBody>
                </Card>
            </Col>
        );
    }
}

export default reduxForm({
    form: 'horizontal_form_validation_two', // a unique identifier for this form
    validate,
})(translate('common')(CampainForm));
