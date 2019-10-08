/* eslint-disable */
import {reduxForm} from "redux-form";
import React, {PureComponent} from "react";
import * as PropTypes from "prop-types";
import {Modal} from "reactstrap";
import {translate} from "react-i18next";

class ModalRankDelete extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        message: PropTypes.string.isRequired,
        modalDelete: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        deleteProject: PropTypes.func.isRequired
    };

    render() {
        return (
            <Modal
                isOpen={this.props.modalDelete}
                toggle={this.props.toggle}
                className='modalClasses modalWebSite'
            >
                <div className="modal__header">
                    <span className="lnr lnr-flag modal__title-icon"></span><h4
                    className="text-modal  modal__title">Warning!</h4></div>
                <div className="modal__body"> Are you sure to delete this project ?!
                </div>
                <div role="toolbar" className="modal__footer btn-toolbar">
                    <button type="button" className="modal_cancel btn btn-success" onClick={this.props.deleteProject}>Oui</button>
                    <button type="button" className="modal_ok btn btn-danger" onClick={this.props.toggle}>Non</button>
                </div>
            </Modal>
        );
    }
}

export default reduxForm({
    form: 'form_project_rank_delete'
})(translate('common')(ModalRankDelete))


