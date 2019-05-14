/* eslint-disable react/no-children-prop */
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
    static propTypes = {
      onSubmit: PropTypes.func.isRequired,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
    };

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
                      type="url"
                      name="backlink"
                      placeholder="Backlink"
                      value={this.props.value}
                      onChange={this.props.onChange}
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
  form: 'floating_labels_form', // a unique identifier for this form
})(translate('common')(FormBacklink));
