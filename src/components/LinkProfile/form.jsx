/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Button, ButtonToolbar } from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import validate from "../../containers/Form/FormValidation/components/validate";
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";

const renderField = ({
                         input, placeholder, type, meta: { touched, error },
                     }) => (
    <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
        <input {...input} placeholder={placeholder} type={type} />
        {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
);

let notification = null;

const showNotification = () => {
    notification.notice({
        content: <BasicNotification
            color="danger"
            title="👋 A Error is present !!!"
            message="This Url is invalid !!!"
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

class HorizontalForm extends PureComponent {
    static propTypes = {
      t: PropTypes.func.isRequired,
      location: PropTypes.string.isRequired,
    };

    constructor() {
      super();
      this.state = {
        showPassword: false,
        valueInput: '',
        redirectTo: false
      };
      this.onChangeInput = this.onChangeInput.bind(this)
    }

    showPassword = (e) => {
      e.preventDefault();
      this.setState({
        showPassword: !this.state.showPassword,
      });
    };

    onSubmit(e) {
        e.preventDefault();
        if (this.state.valueInput.length !== 0) {
            let value = this.state.valueInput;
            if(value.indexOf("https://") !== -1) {
                let new_value = value.split("https://");
                if (new_value[1].indexOf("www.") === -1) {
                    let str_last =  new_value[1].lastIndexOf('.');
                    let replace_str = new_value[1].slice(0, str_last);
                    let replace_str2 = new_value[1].slice(str_last, new_value[1].length);
                    let string_end = replace_str2.replace('.', '-');
                    let replace = replace_str + string_end;
                    if (replace.indexOf(".") !== -1) {
                        let replace_slice = replace.split('.');
                        this.setState({ valueInput : replace_slice[1] });
                        this.setState({ redirectTo : !this.state.redirectTo });
                    } else {
                        this.setState({ valueInput : replace });
                        this.setState({ redirectTo : !this.state.redirectTo });
                    }
                } else {
                    let value_end = new_value[1].split("www.");
                    let replace = value_end[1].replace('.', '-');
                    this.setState({ valueInput : replace });
                    this.setState({ redirectTo : !this.state.redirectTo });
                }
            } else if (value.indexOf("http://") !== -1) {
                let new_value = value.split("http://");
                if (new_value[1].indexOf("www.") === -1) {
                    let str_last =  new_value[1].lastIndexOf('.');
                    let replace_str = new_value[1].slice(0, str_last);
                    let replace_str2 = new_value[1].slice(str_last, new_value[1].length);
                    let string_end = replace_str2.replace('.', '-');
                    let replace = replace_str + string_end;
                    if (replace.indexOf(".") !== -1) {
                        let replace_slice = replace.split('.');
                        this.setState({ valueInput : replace_slice[1] });
                        this.setState({ redirectTo : !this.state.redirectTo });
                    } else {
                        this.setState({ valueInput : replace });
                        this.setState({ redirectTo : !this.state.redirectTo });
                    }
                } else {
                    let value_end = new_value[1].split("www.");
                    let replace = value_end[1].replace('.', '-');
                    this.setState({ valueInput : replace });
                    this.setState({ redirectTo : !this.state.redirectTo });
                }
            } else {
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification(), 700);
            }
        }
    }

    onChangeInput(e) {
      this.setState({ valueInput: e.target.value });
    }

    render() {
        const { t, location } = this.props;
        let redirectMe = this.state.redirectTo;
        if (redirectMe) {
            if (this.state.valueInput.indexOf('.') !== -1) {
                let split_point = this.state.valueInput.split('.');
                let value_end_state = split_point[split_point.length - 2] + '-' + split_point[split_point.length - 1];
                let value_st = this.state.valueInput.split('-');
                let val = value_st.join('.');
                let val_slice = value_end_state.indexOf('/', -1) !== -1 ? value_end_state.replace('/', '') : value_end_state;
                return (
                    <Redirect to={{
                        pathname: '/seo/linkprofile/' + val_slice,
                        state: { domain : val.indexOf('/', -1) !== -1 ? val.replace('/', '') : val }
                    }} />
                );
            } else {
                let route = 'linkprofile/' + this.state.valueInput;
                return (
                    <Redirect to={route} />
                );
            }
        } else {
            if (this.props.location.substr(-1) === "/") {
                return <Redirect to={location.substr(0, location.length - 1)} />;
            } else {
                return (
                    <Col md={12} lg={12}>
                        <Card>
                            <CardBody>
                                <div className="card__title">
                                    <h5 className="bold-text">{t('Form Domains')}</h5>
                                    <h5 className="subhead">Write your domain !!!</h5>
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
                                        <Button color="primary" type="submit">Submit</Button>
                                    </ButtonToolbar>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                );
            }
        }
    }
}

export default reduxForm({
    form: 'horizontal_form_validation_two', // a unique identifier for this form
    validate,
})(translate('common')(HorizontalForm));
