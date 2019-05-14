/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Modal, Table } from 'reactstrap';
import classNames from 'classnames';

export default class ModalAnchors extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        color: PropTypes.string.isRequired,
        colored: PropTypes.bool,
        header: PropTypes.bool,
        btn: PropTypes.string.isRequired,
        data_asc: PropTypes.array.isRequired,
        data_desc: PropTypes.array.isRequired
    };

    static defaultProps = {
        title: '',
        colored: false,
        header: false,
        data_asc: [],
        data_desc: [],
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
            color, btn, title, colored, header,
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
            <div>
                <Button color={color} onClick={this.toggle}>{btn}</Button>
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
                        <Table responsive striped>
                            <thead>
                            <tr>
                                <th>URL</th>
                                <th>Anchor</th>
                                <th>Type : Follow/NoFollow</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.data_asc.map((item) => (
                                    <tr>
                                        <td>{ item.url }</td>
                                        <td>{ item.anchorUrl }</td>
                                        <td>
                                            {
                                                item.noFollow === false ?
                                                    <span className="badge badge-success">Follow</span> :
                                                    <span className="badge badge-danger">NoFollow</span>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }{
                                this.props.data_desc.map((item) => (
                                    <tr>
                                        <td>{ item.url }</td>
                                        <td>{ item.anchorUrl }</td>
                                        <td>
                                            {
                                                item.noFollow === false ?
                                                    <span className="badge badge-success">Follow</span> :
                                                    <span className="badge badge-danger">NoFollow</span>
                                            }
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
