/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Badge, Table } from 'reactstrap';
import CheckIcon from 'mdi-react/CheckIcon';
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import MatTableToolbar from "../../containers/Tables/MaterialTable/components/MatTableToolbar";
import MatTableHead from "../../containers/Tables/MaterialTable/components/MatTableHead";
import MinimalCollapse from "../../containers/UI/Collapse/components/MinimalCollapse";
import {Area, AreaChart, ResponsiveContainer, Tooltip} from "recharts";
import Panel from "../../shared/components/Panel";

export default class ModalAddBacklink extends PureComponent {
    static propTypes = {
      btn: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      data: PropTypes.array.isRequired,
      onSubmit: PropTypes.func.isRequired,
      value: PropTypes.string,
      onChange: PropTypes.func,
    };

    constructor(props) {
      super(props);
      this.state = {
        modal: false,
        data: this.props.data
      };

      this.toggle = this.toggle.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // This will erase any local state updates!
        // Do not do this.
        this.setState({ data: nextProps.data });
    }

    toggle() {
      this.setState({
        modal: !this.state.modal,
      });
    }

    handleClick(event, id) {
        this.setState({ data: this.state.data.map((d, key) => {
                if (key === id) {
                    return {
                        title: d.title,
                        check: !d.check,
                    };
                }
                return d;
            })
        })
    }

    render() {
      const {
        btn, title
      } = this.props;

      return (
        <div className="block_modal">
          <button className="btn btn-primary" onClick={this.toggle}>
            {btn}
          </button>
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className="modal-dialog_form"
          >
            <div className="modal__header">
              <button className="lnr lnr-cross modal__close-btn" onClick={this.toggle} />
              <h4 className="bold-text  modal__title">{ title }</h4>
            </div>
            <div className="modal__body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Number</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.data.map((d, key) => (
                                <tr>
                                    <td>
                                        <Checkbox onClick={e => this.handleClick(e, key)}/>
                                    </td>
                                    <td>
                                        <p className={d.check ? "padding_t_15 checkbox-bar" : "padding_t_15"}>
                                            { d.title }
                                        </p>
                                    </td>
                                    <td className="padding_t_15"><span className="badge badge-success">100</span></td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
            </div>
          </Modal>
        </div>
      );
    }
}
