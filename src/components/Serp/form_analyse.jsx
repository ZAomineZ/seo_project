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

    VerifError (domain)
    {
        axios.get("http://" + window.location.hostname + "/ReactProject/App/Ajax/ErrorSearch.php", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'domain': this.PropsChange(domain)
            }
        }).then((response) => {
            if (response.data.error === '') {
                this.setState({ valueInput: domain });
                this.setState({ redirectTo: !this.state.redirectTo });
            } else {
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification(response.data.error), 700);
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
      const route = `serp_analyse/${this.state.valueInput}`;
      if (redirectMe) {
        return (
          <Redirect to={route} />
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
