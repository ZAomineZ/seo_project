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

const renderField = ({
                         input, placeholder, type, meta: {touched, error},
                     }) => (
    <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
        <textarea {...input} placeholder={placeholder} type={type} cols="30" rows="10"></textarea>
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

    DomainSplit(value) {
        if (value.indexOf("https://") !== -1) {
            let new_value = value.split("https://");
            if (new_value[1].indexOf("www.") === -1) {
                let str_last = new_value[1].lastIndexOf('.');
                let replace_str = new_value[1].slice(0, str_last);
                let replace_str2 = new_value[1].slice(str_last, new_value[1].length);
                let string_end = replace_str2.replace('.', '-');
                let replace = replace_str + string_end;
                if (replace.indexOf(".") !== -1) {
                    let replace_slice = replace.split('.');
                    return replace_slice[1]
                } else {
                    return replace
                }
            } else {
                let value_end = new_value[1].split("www.");
                let replace = value_end[1].replace('.', '-');
                return replace
            }
        } else if (value.indexOf("http://") !== -1) {
            let new_value = value.split("http://");
            if (new_value[1].indexOf("www.") === -1) {
                let str_last = new_value[1].lastIndexOf('.');
                let replace_str = new_value[1].slice(0, str_last);
                let replace_str2 = new_value[1].slice(str_last, new_value[1].length);
                let string_end = replace_str2.replace('.', '-');
                let replace = replace_str + string_end;
                if (replace.indexOf(".") !== -1) {
                    let replace_slice = replace.split('.');
                    return replace_slice[1]
                } else {
                    return replace
                }
            } else {
                let value_end = new_value[1].split("www.");
                let replace = value_end[1].replace('.', '-');
                return replace;
            }
        }
    }

    AjaxSpace (split)
    {
        axios.get("http://" + window.location.hostname + "/ReactProject/App/Ajax/ErrorSearch.php", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'domain': split
            }
        }).then(response => {
            if (response && response.request.status === 200) {
                if (response.data.error === "") {
                    let map = split.map(d => {
                        const domain_title = d.replace(' ', '');
                        return domain_title.replace('\n', '&');
                    });
                    let string = '';
                    map.map((data) => {
                        let data_up = data.replace('.', '-');
                        return string += data_up + '&'
                    });
                    let last = string.substr(0, string.length - 1);
                    this.setState({valueInput: last});
                    this.setState({redirectTo: !this.state.redirectTo});
                } else {
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification(response.data.error), 700);
                }
            }
        })
    }

    AjaxNoSpace (value)
    {
        axios.get("http://" + window.location.hostname + "/ReactProject/App/Ajax/ErrorSearch.php", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'domain': value
            }
        }).then((response) => {
            if (response.data.error === '') {
                let replace = value.replace('.', '-');
                this.setState({valueInput: replace});
                this.setState({redirectTo: !this.state.redirectTo});
            } else {
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification(response.data.error), 700);
            }
        });
    }

    VerifString (value, str)
    {
        if (value) {
            let domain = value.map(d => {
                if (d.indexOf(str) !== -1) {
                    let split = d.split(str);
                    return split[0]
                }
                return d;
            });
            return domain;
        }
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.state.valueInput.length !== 0 && this.state.valueInput.length >= 5) {
            if (this.state.valueInput.indexOf('\n') !== -1) {
                if (this.state.valueInput.indexOf('/') === -1) {
                    let split = this.state.valueInput.split('\n');
                    this.AjaxSpace(split)
                } else {
                    let split = this.state.valueInput.split('\n');
                    let domain = split.map(str => {
                        return this.DomainSplit(str)
                    });
                    let domain_end = domain.map(str => {
                        return str.replace('-', '.')
                    });
                    let domain_last = this.VerifString(domain_end, '/');
                    this.AjaxSpace(domain_last)
                }
            } else {
                if (this.state.valueInput.indexOf('/') === -1) {
                    this.AjaxNoSpace(this.state.valueInput)
                } else {
                    let domainSplit = this.DomainSplit(this.state.valueInput);
                    let DomainEnd = domainSplit.replace('-', '.');
                    this.AjaxNoSpace(DomainEnd)
                }
            }
        } else {
            NotificationSystem.newInstance({}, n => notification = n);
            setTimeout(() => showNotification('Your(s) domain(s) is/are so many or your fiels is empty !!!'), 700);
        }
    }

    onChangeInput(e) {
        this.setState({valueInput: e.target.value});
    }

    render() {
        const {t, location} = this.props;
        const redirectMe = this.state.redirectTo;
        if (redirectMe) {
            return (
                <Redirect to={{
                    pathname: 'keyworddomains/' + this.state.valueInput,
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
                            <h5 className="bold-text">{t('FROM Keywoard')}</h5>
                            <h5 className="subhead">Write yours Domains !!!</h5>
                        </div>
                        <form className="form form--horizontal" onSubmit={e => this.onSubmit(e)}>
                            <div className="form__form-group">
                                <span className="form__form-group-label">Domains</span>
                                <div className="form__form-group-field">
                                    <Field
                                        name="text"
                                        component={renderField}
                                        type="text"
                                        placeholder="Your Domains..."
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
