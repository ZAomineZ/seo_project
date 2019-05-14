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

class AnimatedLineFormWithLabels extends PureComponent {
    static propTypes = {
      website: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      cost: PropTypes.string.isRequired,
      onChangeWebsite: PropTypes.func.isRequired,
      onChangePlatform: PropTypes.func.isRequired,
      onChangeCost: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired,
    };

    render() {
      return (
        <Col md={12} lg={12}>
          <Card>
            <CardBody>
              <form className="form form--horizontal" action="post" onSubmit={this.props.onSubmit}>
                <div className="form__form-group">
                  <span className="form__form-group-label">Website</span>
                  <div className="form__form-group-field">
                    <input
                      type="text"
                      name="website"
                      placeholder="Website"
                      value={this.props.website}
                      onChange={this.props.onChangeWebsite}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Platform</span>
                  <div className="form__form-group-field">
                    <input
                      type="text"
                      name="platform"
                      placeholder="Platform"
                      value={this.props.platform}
                      onChange={this.props.onChangePlatform}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Cost</span>
                  <div className="form__form-group-field">
                    <input
                      type="number"
                      name="cost"
                      placeholder="Cost"
                      value={this.props.cost}
                      onChange={this.props.onChangeCost}
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
})(translate('common')(AnimatedLineFormWithLabels));
