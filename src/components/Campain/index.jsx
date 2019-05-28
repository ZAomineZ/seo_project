/* eslint-disable */
import React, {PureComponent} from 'react';
import { Link } from 'react-router-dom';
import BarCampain from '../Campain/BarCampain';
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import Form from './campain_form';
import axios from "axios";

let notification = null;

const showNotification = (type, message, title) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={title}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: { top: 0, left: 'calc(100vw - 100%)' },
        className: 'left-up',
    });
};

class Campain extends PureComponent {
    constructor (props) {
      super(props);
      this.state = {
          data: []
      };
    }

    componentDidMount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification('error', 'This Campain is not authorized', '👋 A Error is present !!!'), 700);
            }
        }
        axios.get("http://" + window.location.hostname + "/ReactProject/App/Ajax/Campain/CampainIndex.php", {
            params: {
                auth: sessionStorage.getItem('Auth')
            },
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response && response.status === 200) {
                this.setState({ data : response.data})
            }
        })
    }

    componentWillUnmount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                notification.destroy();
            }
        }
    }

    DeleteData (event, slug)
    {
        axios.get("http://" + window.location.hostname + "/ReactProject/App/Ajax/Campain/CampainDelete.php", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'slug': slug,
                'auth': sessionStorage.getItem('Auth')
            }
        }).then((response) => {
            if (response && response.status === 200) {
                const data_delete = this.state.data.filter(i => i.slug !== slug);
                this.setState({data : data_delete});
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification('success', 'Your Campain has been delete !!!', '👋 Success Message'), 700);
            }
        })
    }

    render() {
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="page-title">Add campaign</h3>
                    </div>
                </div>
              <div className="row">
                  <Form location={this.props.location.pathname} />
              </div>
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-xl-12">
                        <div className="card">
                            <div className="card-header">Links Campaign</div>
                            <div className="card-body">
                                <div className="row chart_pt">
                                    <div className="col-md-12 col-lg-12 col-xl-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <BarCampain data={this.state.data}/>
                                                <div className="col-md-12 col-lg-12 col-xl-12 table_chart_card">
                                                    <table className="table--bordered table">
                                                        <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Name</th>
                                                            <th>Nb Link</th>
                                                            <th>Cost</th>
                                                            <th>Action</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            this.state.data.map((d, key) => (
                                                                <tr>
                                                                    <td>
                                                                        { key + 1 }
                                                                    </td>
                                                                    <td>
                                                                        <Link to={"campain/" + d.slug}>{ d.name }</Link>
                                                                    </td>
                                                                    <td>
                                                                        { d.campain.id_count }
                                                                    </td>
                                                                    <td>{ d.cost } $</td>
                                                                    <td>
                                                                        <button className="btn btn-danger" onClick={event => this.DeleteData(event, d.slug)}>Delete</button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                  </div>
                </div>
            </div>
        );
    }
}
export default Campain;
