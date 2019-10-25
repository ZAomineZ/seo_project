/* eslint-disable react/no-children-prop */
/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Button, ButtonToolbar } from 'reactstrap';
import { reduxForm } from 'redux-form';
import TextField from '@material-ui/core/TextField';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

const renderTextField = ({
  input, label, meta: { touched, error }, children, select,
}) => (
  <TextField
    className="material-form__field"
    label={label}
    error={touched && error}
    value={input.value}
    children={children}
    select={select}
    onChange={(e) => {
            e.preventDefault();
            input.onChange(e.target.value);
        }}
  />
);

renderTextField.propTypes = {
  input: PropTypes.shape().isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  select: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
};

renderTextField.defaultProps = {
  meta: null,
  select: false,
  children: [],
};

class FormBacklink extends PureComponent {
    constructor() {
        super();
        this.state = {
            loaded: true
        }
    }

    static propTypes = {
      onSubmit: PropTypes.func.isRequired,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.loading === true) {
            setTimeout(() => this.setState({loaded: false}), 500);
        }
    }

    render() {
      return (
        <Col md={12} lg={12}>
          <Card>
            <CardBody>
              <form className="form form--horizontal" action="post" onSubmit={this.props.onSubmit}>
                <div className="form__form-group">
                  <span className="form__form-group-label">Backlink</span>
                  <div className="form__form-group-field">
                    <input
                      type='url'
                      name="backlink"
                      placeholder="Backlink"
                      value={this.props.value}
                      disabled={!this.state.loaded}
                      onChange={this.props.onChange}
                    />
                  </div>
                </div>
                <ButtonToolbar className="form__button-toolbar">
                    <button type="submit" className={!this.state.loaded ? 'icon expand expand--load btn btn-primary' : 'icon expand btn btn-primary'}>
                        <p>
                            <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                            </svg>
                            Submit
                        </p>
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
  form: 'floating_labels_form', // a unique identifier for this form
})(translate('common')(FormBacklink));
