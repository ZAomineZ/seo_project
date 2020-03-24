/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Modal } from 'reactstrap';
import PointSizes from '../../containers/Charts/ChartJs/components/PointSizes';

export default class ModalProfile extends PureComponent {
    static propTypes = {
      btn: PropTypes.string.isRequired,
      data_power: PropTypes.array.isRequired,
      date: PropTypes.array.isRequired,
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
          <button className="btn btn-outline-secondary" onClick={this.toggle}>
            {btn}
          </button>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
          >
            <div className="modal__header">
              <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
              <h4 className="bold-text  modal__title">Power Graph</h4>
            </div>
            <div className="modal__body">
              <PointSizes data_power={this.props.data_power} date={this.props.date} />
            </div>
            <ButtonToolbar className="modal__footer">
              <button className="btn btn-secondary" onClick={this.toggle}>Close</button>
            </ButtonToolbar>
          </Modal>
        </div>
      );
    }
}
