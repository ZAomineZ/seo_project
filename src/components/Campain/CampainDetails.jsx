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
        console.error = () => {
        };
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
            redirectSerp: false,
            loading: false
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmitLink = this.handleSubmitLink.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeWebsite = this.onChangeWebsite.bind(this);
        this.onChangePlatform = this.onChangePlatform.bind(this);
        this.onChangeCost = this.onChangeCost.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    SetCookie(name_cookie, value_cookie, expire_days) {
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

    CookieReset(token, id) {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({redirectSerp: !this.state.redirectSerp})
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
                    } else if (response.data.error && response.data.error === 'Invalid Value') {
                        this.setState({redirectSerp: !this.state.redirectSerp})
                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification('Error Message', response.data.error, 'danger'), 700);
                    } else {
                        this.setState({redirectCampain: !this.state.redirectCampain});
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
                                    follow: d.follow,
                                    indexable: d.indexable,
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
        let urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
        if (this.state.value !== '' && urlRegex.test(this.state.value)) {
            this.setState({loading: !this.state.loading});
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
                        this.setState({data: response.data.data}),
                            this.setState({
                                value: ''
                            });
                    }
                }
            });
        }
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
                        follow: d.follow,
                        indexable: d.indexable,
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
                                                        <th>Follow</th>
                                                        <th>Indexed</th>
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
                                                                                              loading={this.state.loading}
                                                                                              onSubmit={e => this.handleSubmit(e, d.id, d.website)}
                                                                                              btn="Add BL"/>}

                                                                </td>
                                                                <td>
                                                                    <p>
                                                                        {
                                                                            d.follow !== '' && d.follow === '1' ?
                                                                                <svg className="mdi-icon" width="24"
                                                                                     height="24" fill="#4ce1b6"
                                                                                     viewBox="0 0 24 24">
                                                                                    <path
                                                                                        d="M5,9V21H1V9H5M9,21C7.9,21 7,20.1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z"></path>
                                                                                </svg> :
                                                                                <svg className="mdi-icon " width="24"
                                                                                     height="24" fill="#ff4861"
                                                                                     viewBox="0 0 24 24">
                                                                                    <path
                                                                                        d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"></path>
                                                                                </svg>
                                                                        }
                                                                    </p>
                                                                </td>
                                                                <td>
                                                                    <p>
                                                                        {
                                                                            d.indexable !== '' && d.indexable === '1' ?
                                                                                <svg className="mdi-icon" width="24"
                                                                                     height="24" fill="#4ce1b6"
                                                                                     viewBox="0 0 24 24">
                                                                                    <path
                                                                                        d="M5,9V21H1V9H5M9,21C7.9,21 7,20.1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z"></path>
                                                                                </svg> :
                                                                                <svg className="mdi-icon " width="24"
                                                                                     height="24" fill="#ff4861"
                                                                                     viewBox="0 0 24 24">
                                                                                    <path
                                                                                        d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"></path>
                                                                                </svg>
                                                                        }
                                                                    </p>
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
