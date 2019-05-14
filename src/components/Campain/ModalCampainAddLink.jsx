/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import AnimatedLineFormWithLabels from "../../containers/Form/FloatingLabelsForm/components/AnimatedLineFormWithLabels";

export default class ModalCampainAddLink extends PureComponent {
    static propTypes = {
        btn: PropTypes.string.isRequired,
        website: PropTypes.string.isRequired,
        platform: PropTypes.string.isRequired,
        cost: PropTypes.string.isRequired,
        onChangeWebsite: PropTypes.func.isRequired,
        onChangePlatform: PropTypes.func.isRequired,
        onChangeCost: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        toggle: PropTypes.func.isRequired,
        modal: PropTypes.bool.isRequired
    };

    constructor() {
      super();
    }

    render() {
      const {
        btn,
      } = this.props;

      return (
        <div className="ml-1">
          <button className="btn btn-primary btn_modal" onClick={this.props.toggle}>
            {btn}
          </button>
          <Modal
            isOpen={this.props.modal}
            toggle={this.props.toggle}
            className="modal-dialog_form"
          >
            <div className="modal__header">
              <button className="lnr lnr-cross modal__close-btn" onClick={this.props.toggle} />
              <h4 className="bold-text  modal__title">Add link</h4>
            </div>
            <div className="modal__body">
              <AnimatedLineFormWithLabels
                website={this.props.website}
                platform={this.props.platform}
                cost={this.props.cost}
                onChangeWebsite={this.props.onChangeWebsite}
                onChangePlatform={this.props.onChangePlatform}
                onChangeCost={this.props.onChangeCost}
                onSubmit={this.props.onSubmit}
              />
            </div>
          </Modal>
        </div>
      );
    }
}
