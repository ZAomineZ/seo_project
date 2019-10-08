/* eslint-disable */
import React, {PureComponent} from 'react';
import BarCampainDetails from '../Campain/BarCampainDetails';
import ModalCampainAddLink from '../Campain/ModalCampainAddLink';
import ModalAddBacklink from '../Campain/ModalAddBacklink';
import {Button, ButtonToolbar, Popover, PopoverHeader} from 'reactstrap';
import axios from "axios";
import {route} from '../../const'
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import {Redirect} from "react-router-dom";

let notification = null;

const showNotification = (title, message, color) => {
    notification.notice({
        content: <BasicNotification
            color={color}
            title={title}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class CampainDetails extends PureComponent {
    constructor(props) {
        super(props);
        console.error = () => {};
        console.error();
        this.state = {
            data: [],
            data_chart: [],
            value: '',
            website: '',
            platform: '',
            cost: '',
            modal: false,
            Popper: false,
            redirectCampain: false,
            redirectSerp: false
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmitLink = this.handleSubmitLink.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeWebsite = this.onChangeWebsite.bind(this);
        this.onChangePlatform = this.onChangePlatform.bind(this);
        this.onChangeCost = this.onChangeCost.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    SetCookie (name_cookie, value_cookie, expire_days)
    {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    getCookie(name_cookie) {
        let name = name_cookie + '=';
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let cook = cookie[i];
            while (cook.charAt(0) == ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) == 0) {
                return cook.substring(name.length, cook.length);
            }
            return '';
        }
    }

    CookieReset (token, id)
    {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({ redirectSerp : !this.state.redirectSerp})
    }

    componentDidMount() {
        axios.get("http://" + window.location.hostname + route + "/Ajax/Campain/DataCampain.php", {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                'Access-Control-Max-Age': 1728000,
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
            },
            params: {
                slug: this.props.match.params.web,
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '',
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today')
            }
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data && !response.data.error) {
                    this.setState({data: response.data.data, data_chart: response.data.data_chart})
                } else {
                    if (response.data.error && response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    }  else if (response.data.error && response.data.error === 'Invalid Value') {
                        this.setState({ redirectSerp : !this.state.redirectSerp})
                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification('Error Message', response.data.error, 'danger'), 700);
                    } else {
                        this.setState({ redirectCampain: !this.state.redirectCampain });
                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification('Error Message', response.data.error, 'danger'), 700);
                    }
                }
            }
        });
    }

    handleClickReceived(event, id, type) {
        axios.get("http://" + window.location.hostname + route + "/Ajax/Campain/UpdateData.php", {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                'Access-Control-Max-Age': 1728000,
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
            },
            params: {
                id: id,
                type: type,
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '',
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today')
            }
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    }
                } else {
                    this.setState({
                        data: this.state.data.map((d) => {
                            if (d.id === id) {
                                return {
                                    id: d.id,
                                    website: d.website,
                                    platform: d.platform,
                                    cost: d.cost,
                                    date: d.date,
                                    received: type,
                                    backlink: d.backlink,
                                    bl_found: d.bl_found,
                                    date_check: d.date_check,
                                    Popper: this.state.Popper,
                                };
                            }
                            return d;
                        }),
                    });
                }
            }
        });
    }

    handleSubmit(event, id, bl) {
        event.preventDefault();
        axios.get("http://" + window.location.hostname + route + "/Ajax/Campain/UpdateDataBl.php", {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                'Access-Control-Max-Age': 1728000,
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
            },
            params: {
                id: id,
                value: this.state.value,
                bl: bl,
                slug: this.props.match.params.web,
                auth:sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '',
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today')
            }
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    }
                } else {
                    this.setState({data: response.data.data}),
                        this.setState({
                            value: ''
                        });
                }
            }
        });
    }

    onChange(event) {
        this.setState({
            value: event.target.value
        })
    }

    onChangeWebsite(event) {
        this.setState({
            website: event.target.value
        })
    }

    onChangePlatform(event) {
        this.setState({
            platform: event.target.value
        })
    }

    onChangeCost(event) {
        this.setState({
            cost: event.target.value
        })
    }

    handleSubmitLink(event) {
        event.preventDefault();
        if (this.state.website !== '' && this.state.platform !== '' && this.state.cost !== '') {
            axios.get("http://" + window.location.hostname + route + "/Ajax/Campain/CampainDetails.php", {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                    'Access-Control-Max-Age': 1728000,
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
                },
                params: {
                    website: this.state.website,
                    platform: this.state.platform,
                    cost: this.state.cost,
                    slug: this.props.match.params.web,
                    auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '',
                    cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today')
                }
            }).then((response) => {
                if (response && response.status === 200) {
                    if (response.data.error) {
                        if (response.data.error === 'Invalid Token') {
                            this.CookieReset(response.data.token, response.data.id)
                        }
                    } else {
                        this.setState({data: response.data.data, data_chart: response.data.data_chart});
                        this.setState({
                            website: '',
                            platform: '',
                            cost: '',
                            modal: false,
                        });
                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification('Success Message', 'Your backlink has been add !!!', 'success'), 700);
                    }
                }
            });
        }
        return this.state.data;
    }

    onDeleteBackLink(event, id) {
        axios.get("http://" + window.location.hostname + route + "/Ajax/Campain/CampainItemDelete.php", {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                'Access-Control-Max-Age': 1728000,
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
            },
            params: {
                id: id,
                slug: this.props.match.params.web,
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '',
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today')
            }
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    }
                } else {
                    const data_bl = this.state.data.filter(i => i.id !== id);
                    this.setState({data: data_bl, data_chart: response.data});
                    NotificationSystem.newInstance({}, n => notification = n);
                    setTimeout(() => showNotification('Success Message', 'Your backlink has been delete !!!', 'success'), 700);
                }
            }
        });
    }

    toggle = (event, id, type) => {
        this.setState({
            data: this.state.data.map((d) => {
                if (d.id === id) {
                    return {
                        id: d.id,
                        website: d.website,
                        platform: d.platform,
                        cost: d.cost,
                        date: d.date,
                        received: d.received,
                        backlink: d.backlink,
                        bl_found: d.bl_found,
                        date_check: d.date_check,
                        Popper: type,
                    };
                }
                return d;
            }),
        });
    };

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        })
    }

    render() {
        if (this.state.redirectSerp === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
        if (this.state.redirectCampain) {
            return (
                <Redirect to={{
                    pathname: '/seo/campain',
                }}/>
            )
        }
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="page-title">Campaign : {this.props.match.params.web}</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            Links Campaign
                            <ModalCampainAddLink
                                website={this.state.website}
                                platform={this.state.platform}
                                cost={this.state.cost}
                                onChangeWebsite={this.onChangeWebsite}
                                onChangePlatform={this.onChangePlatform}
                                onChangeCost={this.onChangeCost}
                                onSubmit={this.handleSubmitLink}
                                toggle={this.toggleModal}
                                modal={this.state.modal}
                                btn="Add link"/>
                        </div>
                        <div className="card-body">
                            <div className="row chart_pt">
                                <div className="col-md-12 col-lg-12 col-xl-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <BarCampainDetails data={this.state.data_chart}/>
                                            <div className="col-md-12 col-lg-12 col-xl-12 table_chart_card">
                                                <table className="table--bordered table">
                                                    <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>WebSite</th>
                                                        <th>Platform</th>
                                                        <th>Cost</th>
                                                        <th>Date</th>
                                                        <th>Received</th>
                                                        <th>BL Check</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        this.state.data.map((d, key) => (
                                                            <tr>
                                                                <td>
                                                                    {key + 1}
                                                                </td>
                                                                <td>
                                                                    {d.website}
                                                                </td>
                                                                <td>
                                                                    {d.platform}
                                                                </td>
                                                                <td>
                                                                    {d.cost} €
                                                                </td>
                                                                <td>{d.date}</td>
                                                                <td>
                                                                    {d.received === '1' ?
                                                                        <button className="btn btn-success"
                                                                                onClick={e => this.handleClickReceived(e, d.id, '0')}>Received</button> :
                                                                        <button className="btn btn-warning"
                                                                                onClick={e => this.handleClickReceived(e, d.id, '1')}>Not
                                                                            Received</button>}
                                                                </td>
                                                                <td>
                                                                    {d.backlink !== '' && d.bl_found === '1' ?
                                                                        <ButtonToolbar className="">
                                                                            {
                                                                                d.Popper === false ?
                                                                                    <Button id={'PopoverTop-' + d.id}
                                                                                            onClick={e => this.toggle(e, d.id, true)}
                                                                                            outline>
                                                                                        Backlink Found
                                                                                    </Button>
                                                                                    :
                                                                                    <Button id={'PopoverTop-' + d.id}
                                                                                            onClick={e => this.toggle(e, d.id, false)}
                                                                                            outline>
                                                                                        Backlink Found
                                                                                    </Button>
                                                                            }
                                                                            {
                                                                                d.Popper === false ?
                                                                                    <Popover
                                                                                        placement="top"
                                                                                        isOpen={d.Popper}
                                                                                        target={'PopoverTop-' + d.id}
                                                                                        toggle={e => this.toggle(e, d.id, true)}
                                                                                    >
                                                                                        <PopoverHeader>{d.backlink}</PopoverHeader>
                                                                                    </Popover>
                                                                                    :
                                                                                    <Popover
                                                                                        placement="top"
                                                                                        isOpen={d.Popper}
                                                                                        target={'PopoverTop-' + d.id}
                                                                                        toggle={e => this.toggle(e, d.id, false)}
                                                                                    >
                                                                                        <PopoverHeader>{d.backlink}</PopoverHeader>
                                                                                    </Popover>
                                                                            }
                                                                        </ButtonToolbar> : d.backlink !== '' && d.bl_found === '0' ?
                                                                            <span className="red-text">Backlink not found !!!</span> :
                                                                            <ModalAddBacklink value={this.state.value}
                                                                                              onChange={this.onChange}
                                                                                              onSubmit={e => this.handleSubmit(e, d.id, d.website)}
                                                                                              btn="Add BL"/>}

                                                                </td>
                                                                <td>
                                                                    <button className="btn btn-danger"
                                                                            onClick={e => this.onDeleteBackLink(e, d.id)}>Delete
                                                                    </button>
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
        );
    }
}

export default CampainDetails;
