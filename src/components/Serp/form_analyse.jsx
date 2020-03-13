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
import {route, requestUri} from '../../const'

const renderField = ({
  input, placeholder, type, meta: { touched, error },
}) => (
  <div className="form__form-group-input-wrap form__form-group-input-wrap--error-above">
    <input {...input} placeholder={placeholder} type={type} />
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
        redirectSerp: false
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
        let str_last =  string.lastIndexOf('-');
        let replace_str = string.slice(0, str_last);
        let replace_str2 = string.slice(str_last, string.length);
        let string_end = replace_str2.replace('-', '.');
        return replace_str + string_end
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

    VerifError (domain)
    {
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
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
            }
        }).then((response) => {
            if (response.data.error === '') {
                this.setState({ valueInput: domain });
                setInterval(() => this.setState({ redirectTo: !this.state.redirectTo }), 1000)
            } else {
                if (response.data.error === 'Invalid Token') {
                    this.CookieReset(response.data.token, response.data.id)
                } else {
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification(response.data.error), 700);
                }
            }
        })
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
            setTimeout(() => showNotification(), 700); }
        }
    }

    onChangeInput(e) {
      this.setState({ valueInput: e.target.value });
    }

    render() {
      const { t, location } = this.props;
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
                      state: { domain : val.indexOf('/', -1) !== -1 ? val.replace('/', '') : val }
                  }} />
              );
          } else {
              const route = `serp_analyse/${this.state.valueInput}`;
              return (
                  <Redirect to={route} />
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
        return <Redirect to={location.substr(0, location.length - 1)} />;
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
})(translate('common')(FormAnalyse));
