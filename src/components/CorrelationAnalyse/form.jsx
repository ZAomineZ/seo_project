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
import NotificationMessage from "../../js/NotificationMessage";

const renderField = ({
                         input, placeholder, type, meta: {touched, error},
                     }) => (
    <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
        <input {...input} placeholder={placeholder} type={type}/>
        {touched && error && <span className="form__form-group-error">{error}</span>}
    </div>
);

let notification = null;

const showNotification = (error, message) => {
    notification.notice({
        content: <BasicNotification
            color="danger"
            title={error}
            message={message ? message : "This Url is invalid !!!" }
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

    NotificationError = (message, title, type) => NotificationMessage.notification(message, title, type);

    onSubmit(e) {
        e.preventDefault();

        if (this.state.valueInput !== '' && this.state.valueInput.length >= 3) {
            if (/^[a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF' ]*$/i.test(this.state.valueInput)) {
                this.setState({redirectTo: !this.state.redirectTo});
            } else {
                return this.NotificationError('Your Keyword is not valid !!!', '👋 Error Find !!!', 'danger');
            }
        } else {
            return this.NotificationError('Your Form Keyword is empty or so short !!!', '👋 Error Find !!!', 'danger');
        }
    }

    onChangeInput(e) {
        this.setState({valueInput: e.target.value});
    }

    render() {
        const {t, location} = this.props;
        const redirectMe = this.state.redirectTo;

        let Slugify = require('slugifyjs').fromLocale('en');
        if (redirectMe) {
            return (
                <Redirect to={{
                    pathname: '/seo/correlationData/' + Slugify.parse(this.state.valueInput),
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
                            <h5 className="bold-text">{t('FROM Keyword')}</h5>
                            <h5 className="subhead">Write your Keyword !!!</h5>
                        </div>
                        <form className="form form--horizontal" onSubmit={e => this.onSubmit(e)}>
                            <div className="form__form-group">
                                <span className="form__form-group-label">Keyword</span>
                                <div className="form__form-group-field">
                                    <Field
                                        name="keyword"
                                        component={renderField}
                                        type="text"
                                        placeholder="Your Keyword..."
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
})

(
    translate(
        'common'
    )(
        CampainForm
    ))
;
