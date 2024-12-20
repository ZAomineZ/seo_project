/* eslint-disable */
import React, {PureComponent} from 'react';
import {Card, CardBody, Col, Button, ButtonToolbar} from 'reactstrap';
import {Field, reduxForm} from 'redux-form';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import validate from '../../containers/Form/FormValidation/components/validate';
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import axios from "axios";
import {route, requestUri} from '../../const';
import Cookie from '../../js/Cookie';
import ResponseAjax from '../../js/ResponseAjax'

const renderField = ({
                         input, placeholder, type, meta: {touched, error},
                     }) => (
    <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
        <input {...input} placeholder={placeholder} type={type}/>
        {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
);

let notification = null;

const showNotification = (error) => {
    notification.notice({
        content: <BasicNotification
            color="danger"
            title={error}
            message="This Url is invalid !!!"
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
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

class FormAnalyse extends PureComponent {
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
            redirectSerp: false,

            loading: false,
            loaded: true
        };
        this.onChangeInput = this.onChangeInput.bind(this);
    }

    showPassword = (e) => {
        e.preventDefault();
        this.setState({
            showPassword: !this.state.showPassword,
        });
    };

    PropsChange(string) {
        let str_last = string.lastIndexOf('-');
        let replace_str = string.slice(0, str_last);
        let replace_str2 = string.slice(str_last, string.length);
        let string_end = replace_str2.replace('-', '.');
        return replace_str + string_end
    }

    VerifError(domain) {
        this.setState({loading: true, loaded: false});

        axios.get(requestUri + window.location.hostname + route + "/Ajax/ErrorSearch.php", {
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
                domain: this.PropsChange(domain),
                cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
            }
        }).then((response) => {
            if (response.data.error === '') {
                return this.anyErrorAjax(domain);
            } else {
                if (response.data.error === 'Invalid Token') {
                    ResponseAjax.ForbiddenResponse(response);
                    this.setState({redirectSerp: !this.state.redirectSerp})
                } else {
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification(response.data.error), 700);
                }
            }
        })
    }

    /**
     * @param {string} domain
     */
    anyErrorAjax(domain)
    {
        this.setState({
            valueInput: domain,
            loading: false
        });
        setInterval(() => this.setState({loaded: !this.state.loaded}), 1000);
        setInterval(() => this.setState({redirectTo: !this.state.redirectTo}), 1000)
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.state.valueInput.length !== 0) {
            const value = this.state.valueInput;
            if (value.indexOf('https://') !== -1) {
                const new_value = value.split('https://');
                if (new_value[1].indexOf('www.') === -1) {
                    const str_last = new_value[1].lastIndexOf('.');
                    const replace_str = new_value[1].slice(0, str_last);
                    const replace_str2 = new_value[1].slice(str_last, new_value[1].length);
                    const string_end = replace_str2.replace('.', '-');
                    const replace = replace_str + string_end;
                    if (replace.indexOf('.') !== -1) {
                        const replace_slice = replace.split('.');
                        this.VerifError(replace_slice[1])
                    } else {
                        this.VerifError(replace)
                    }
                } else {
                    const value_end = new_value[1].split('www.');
                    const replace = value_end[1].replace('.', '-');
                    this.VerifError(replace)
                }
            } else if (value.indexOf('http://') !== -1) {
                const new_value = value.split('http://');
                if (new_value[1].indexOf('www.') === -1) {
                    const str_last = new_value[1].lastIndexOf('.');
                    const replace_str = new_value[1].slice(0, str_last);
                    const replace_str2 = new_value[1].slice(str_last, new_value[1].length);
                    const string_end = replace_str2.replace('.', '-');
                    const replace = replace_str + string_end;
                    if (replace.indexOf('.') !== -1) {
                        const replace_slice = replace.split('.');
                        this.VerifError(replace_slice[1])
                    } else {
                        this.VerifError(replace)
                    }
                } else {
                    const value_end = new_value[1].split('www.');
                    const replace = value_end[1].replace('.', '-');
                    this.VerifError(replace)
                }
            } else {
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification(), 700);
            }
        }
    }

    onChangeInput(e) {
        this.setState({valueInput: e.target.value});
    }

    render() {
        const {t, location} = this.props;
        const {loaded} = this.state;

        const redirectMe = this.state.redirectTo;
        if (redirectMe) {
            if (this.state.valueInput.indexOf('.') !== -1) {
                let split_point = this.state.valueInput.split('.');
                let value_end_state = split_point[split_point.length - 2] + '-' + split_point[split_point.length - 1];
                let value_st = this.state.valueInput.split('-');
                let val = value_st.join('.');
                let val_slice = value_end_state.indexOf('/', -1) !== -1 ? value_end_state.replace('/', '') : value_end_state;
                return (
                    <Redirect to={{
                        pathname: '/seo/serp_analyse/' + val_slice,
                        state: {domain: val.indexOf('/', -1) !== -1 ? val.replace('/', '') : val}
                    }}/>
                );
            } else {
                const route = `serp_analyse/${this.state.valueInput}`;
                return (
                    <Redirect to={route}/>
                );
            }
        }
        if (this.state.redirectSerp === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
        if (location.substr(-1) === '/') {
            return <Redirect to={location.substr(0, location.length - 1)}/>;
        }
        return (
            <Col md={12} lg={12}>
                <Card>
                    <CardBody>
                        <div className="card__title">
                            <h5 className="bold-text">{t('Form Url')}</h5>
                            <h5 className="subhead">Write your Url !!!</h5>
                        </div>
                        <form className="form form--horizontal" onSubmit={e => this.onSubmit(e)}>
                            <div className="form__form-group">
                                <span className="form__form-group-label">Url</span>
                                <div className="form__form-group-field">
                                    <Field
                                        name="url"
                                        component={renderField}
                                        type="url"
                                        placeholder="https://themeforest.net"
                                        onChange={this.onChangeInput}
                                    />
                                </div>
                            </div>
                            <ButtonToolbar className="form__button-toolbar">
                                <button className='btn btn-primary' type='submit'>
                                    {!loaded &&
                                        <div className='panel__refresh panel-refresh-custom'>
                                            <svg className="mdi-icon " width="24" height="24" fill="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                                            </svg>
                                        </div>
                                    }
                                    Submit
                                </button>
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
})(translate('common')(FormAnalyse));
