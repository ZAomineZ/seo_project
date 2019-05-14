import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import FormBacklink from './FormBacklink';

export default class ModalAddBacklink extends PureComponent {
    static propTypes = {
      btn: PropTypes.string.isRequired,
      onSubmit: PropTypes.func.isRequired,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
    };

    constructor() {
      super();
      this.state = {
        modal: false,
      };

      this.toggle = this.toggle.bind(this);
    }

    toggle() {
      this.setState({
        modal: !this.state.modal,
      });
    }

    render() {
      const {
        btn,
      } = this.props;

      return (
        <div className="ml-1">
          <button className="btn btn-default" onClick={this.toggle}>
            {btn}
          </button>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className="modal-dialog_form"
          >
            <div className="modal__header">
              <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
              <h4 className="bold-text  modal__title">Add Backlink</h4>
            </div>
            <div className="modal__body">
              <FormBacklink value={this.props.value} onChange={this.props.onChange} onSubmit={this.props.onSubmit} />
            </div>
          </Modal>
        </div>
      );
    }
}
