/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Modal } from 'reactstrap';
import TabBacklinks from './tab_backlinks';

export default class ModalInfoBackLinks extends PureComponent {
    static propTypes = {
      btn: PropTypes.number.isRequired,
      data: PropTypes.array.isRequired,
      data_page: PropTypes.array.isRequired,
      anchor_data: PropTypes.array.isRequired,
      anchor_label: PropTypes.array.isRequired,
      follow: PropTypes.number.isRequired,
      nofollow: PropTypes.number.isRequired,
      image: PropTypes.number.isRequired,
      text: PropTypes.number.isRequired,
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
          >
            <div className="modal__header">
              <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
              <h4 className="bold-text modal__title">Backlink info</h4>
            </div>
            <div className="modal__body">
              <TabBacklinks follow={this.props.follow}
                            nofollow={this.props.nofollow}
                            text={this.props.text}
                            image={this.props.image}
                            data_page={this.props.data_page}
                            data={this.props.data}
                            anchor_data={this.props.anchor_data}
                            anchor_label={this.props.anchor_label} />
            </div>
            <ButtonToolbar className="modal__footer">
              <button className="btn btn-default" onClick={this.toggle}>Close</button>
            </ButtonToolbar>
          </Modal>
        </div>
      );
    }
}
