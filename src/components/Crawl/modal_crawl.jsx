/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Modal, Table } from 'reactstrap';
import classNames from 'classnames';

export default class ModalComponent extends PureComponent {
    static propTypes = {
      title: PropTypes.string,
      message: PropTypes.string,
      color: PropTypes.string.isRequired,
      colored: PropTypes.bool,
      header: PropTypes.bool,
      btn: PropTypes.number.isRequired,
      data: PropTypes.array.isRequired,
    };

    static defaultProps = {
      title: '',
      message: '',
      colored: false,
      header: false,
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
        color, btn, title, message, colored, header,
      } = this.props;
      let Icon;

      switch (color) {
        case 'primary':
          Icon = <span className="lnr lnr-pushpin modal__title-icon" />;
          break;
        case 'success':
          Icon = <span className="lnr lnr-thumbs-up modal__title-icon" />;
          break;
        case 'warning':
          Icon = <span className="lnr lnr-flag modal__title-icon" />;
          break;
        case 'danger':
          Icon = <span className="lnr lnr-cross-circle modal__title-icon" />;
          break;
        default:
          break;
      }
      const modalClass = classNames({
        'modal-dialog--colored': colored,
        'modal-dialog--header': header,
      });

      return (
        <div className="ml-1">
          <Button
            color={color}
            onClick={this.toggle}
            className="badge badge-secondary"
          >
            {btn}
          </Button>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={`modal-dialog--${color} ${modalClass}`}
          >
            <div className="modal__header">
              <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
              {header ? '' : Icon}
              <h4 className="bold-text  modal__title">{title}</h4>
            </div>
            <div className="modal__body">
              <Table responsive className="table--bordered table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {
                        this.props.data.map((d, key) => (
                          <tr>
                            <td>
                              { key + 1 }
                            </td>
                            <td>
                              { d }
                            </td>
                          </tr>
                        ))
                    }
                </tbody>
              </Table>
            </div>
            <ButtonToolbar className="modal__footer">
              <Button onClick={this.toggle}>Cancel</Button>{' '}
              <Button outline={colored} color={color} onClick={this.toggle}>Ok</Button>
            </ButtonToolbar>
          </Modal>
        </div>
      );
    }
}
