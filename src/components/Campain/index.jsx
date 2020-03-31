/* eslint-disable */
import React, {PureComponent} from 'react';
import {Link, Redirect} from 'react-router-dom';
import BarCampain from '../Campain/BarCampain';
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import Form from './campain_form';
import axios from "axios";
import {route, requestUri} from '../../const'
import Cookie from "../../js/Cookie";
import NotificationMessage from "../../js/NotificationMessage";

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
      console.error = () => {};
      console.error();
      this.state = {
          data: [],
          redirectSerp: false
      };
    }

    CookieReset (token, id)
    {
        Cookie.CookieReset(token, id);
        this.setState({ redirectSerp : !this.state.redirectSerp})
    }

    componentDidMount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                return NotificationMessage.notification('This Campain is not authorized', '👋 A Error is present !!!', 'danger');
            }
        }

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        const params = {
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '',
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today')
        };

        axios.get(requestUri + window.location.hostname  + route + "/Ajax/Campain/CampainIndex.php", {
            params: params,
            headers: headers,
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    } else {
                        this.setState({ redirectSerp : !this.state.redirectSerp});
                        return NotificationMessage.notification(response.data.error, '👋 Success Message', 'danger');
                    }
                } else {
                    this.setState({ data : response.data})
                }
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
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        const params = {
            slug: slug,
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '',
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today')
        };

        axios.get(requestUri + window.location.hostname + route + "/Ajax/Campain/CampainDelete.php", {
            headers: headers,
            params: params,
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    } else {
                        this.setState({redirectSerp: !this.state.redirectSerp});
                        return NotificationMessage.notification(response.data.error, '👋 Error Message', 'danger');
                    }
                } else {
                    const data_delete = this.state.data.filter(i => i.slug !== slug);
                    this.setState({data : data_delete});

                    return NotificationMessage.notification('Your Campain has been delete !!!', '👋 Success Message', 'success');
                }
            }
        })
    }

    render() {
        if (this.state.redirectSerp) {
            return (
                <Redirect to={{
                    pathname: 'serp',
                }}/>
            );
        }
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
