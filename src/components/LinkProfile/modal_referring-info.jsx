/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, Modal } from 'reactstrap';

export default class ModalInfoReferring extends PureComponent {
    static propTypes = {
      btn: PropTypes.number.isRequired,
      referring_data: PropTypes.array.isRequired,
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
            className="modal-dialog_style"
          >
            <div className="modal__header">
              <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
              <h4 className="bold-text  modal__title">Referring domains</h4>
            </div>
            <div className="modal__body">
              <div className="card">
                <div className="card-header">
                      Top Ref Domains
                </div>
                <div className="card_style card-body">
                  <table className="table--bordered table">
                    <thead>
                      <tr>
                        <th>Nomber</th>
                        <th>Url</th>
                        <th>IP</th>
                        <th>Backlinks</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.props.referring_data.map(d => (
                          <tr>
                              <td>
                                  <span className="badge badge-primary">{ d.domain_trust_score }</span>
                              </td>
                              <td>
                                  <a href="http://www.meilleurduweb.com/">{ d.domain }</a>
                              </td>
                              <td><span className="badge badge-success">{ d.ip }</span></td>
                              <td><span className="span_primary_tab badge badge-primary">{ d.backlinks_num }</span></td>
                          </tr>
                      ))
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <ButtonToolbar className="modal__footer">
              <button className="btn btn-default" onClick={this.toggle}>Close</button>
            </ButtonToolbar>
          </Modal>
        </div>
      );
    }
}
