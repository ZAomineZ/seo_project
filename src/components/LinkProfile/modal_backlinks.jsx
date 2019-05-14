import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Modal } from 'reactstrap';

export default class ModalBacklinks extends PureComponent {
    static propTypes = {
      btn: PropTypes.string.isRequired,
      img_backlink: PropTypes.string.isRequired,
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
          <button className="btn btn-primary" onClick={this.toggle}>
            {btn}
          </button>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
          >
            <div className="modal__header">
              <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
              <h4 className="bold-text  modal__title">Backlinks reviewed</h4>
            </div>
            <div className="modal__body">
              <img src={this.props.img_backlink} alt="" />
            </div>
            <ButtonToolbar className="modal__footer">
              <button className="btn btn-default" onClick={this.toggle}>Close</button>
            </ButtonToolbar>
          </Modal>
        </div>
      );
    }
}
