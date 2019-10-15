/* eslint-disable */
import React, {PureComponent} from "react";
import ChartRank from "./ChartRank";
import axios from "axios";
import {route} from "../../const";
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import RankTable from "./RankTable";
import {Redirect} from "react-router-dom";

let notification = null;

const showNotification = (type, title, message) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={title}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

export default class indexKeyword extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataKeywordsByWebsite: [],
            countKeywords: 0,
            loading: true,
            loaded: false,
            redirectTo: false,
            redirectSerp: false
        }
    }

    /**
     * Create cookie User Auth If We reseted The Cookie in progress !!!
     * @param name_cookie
     * @param value_cookie
     * @param expire_days
     * @returns {string}
     * @constructor
     */
    SetCookie(name_cookie, value_cookie, expire_days) {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    /**
     * Recuperate Cookie User
     * @param name_cookie
     * @returns {string}
     */
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

    /**
     * Reset Cookie User When Invalid Token found in the Request Ajax with Axios
     * @param token
     * @param id
     * @constructor
     */
    CookieReset(token, id) {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({redirectSerp: !this.state.redirectSerp})
    }

    submitNotification(type, title, message) {
        NotificationSystem.newInstance({}, n => notification = n);
        setTimeout(() => showNotification(type, title, message), 700);
    }

    componentDidMount() {
        let project = this.props.match.params.project;
        if (project !== '') {
            axios.get('http://' + window.location.hostname + route + '/Ajax/RankByProject.php', {
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
                    project: project,
                    cookie: this.getCookie('remember_me_auth') ?
                        this.getCookie('remember_me_auth') :
                        this.getCookie('auth_today'),
                    auth: sessionStorage.getItem('Auth') ?
                        sessionStorage.getItem('Auth')
                        : ''
                }
            }).then((response) => {
                if (response && response.status === 200) {
                    if (response.data.error) {
                        if (response.data.error === 'Invalid Token') {
                            this.CookieReset(response.data.token, response.data.id)
                        } else {
                            this.setState({redirectTo: !this.state.redirectTo});
                            this.submitNotification('danger', '👋 Error Found !!!', response.data.error);
                        }
                    } else {
                        if (response.data.data && response.data.dataKeywordsByWebsite) {
                            const data = Object.values(response.data.data);
                            const dataKeywordsByWebsite = Object.values(response.data.dataKeywordsByWebsite);
                            this.setState({
                                data: data,
                                dataKeywordsByWebsite: dataKeywordsByWebsite,
                                countKeywords: response.data.countKeywords,
                                loading: false
                            });
                            setTimeout(() => this.setState({loaded: true}), 500);
                        }
                    }
                }
            })
        }
    }

    render() {
        if (this.state.redirectTo) {
            return (
                <Redirect to={{
                    pathname: '/seo/rankTo'
                }}/>
            )
        } else if (this.state.redirectSerp) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            )
        }
        return (
            <div className='dashboard container'>
                {!this.state.loaded &&
                <div className="panel__refresh">
                    <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                    </svg>
                </div>
                }
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="page-title">Rank To</h3>
                        <h3 className="page-subhead subhead">
                            Check the ranking of a website by keyword over a long period
                        </h3>
                    </div>
                    <div className="col-xl-12">
                        <ChartRank data={this.state.data} project={this.props.match.params.project}/>
                    </div>
                    <div className="col-xl-12">
                        <RankTable
                            title={'Dashboard Rank Keyword (' + this.state.countKeywords + ')'}
                            project={this.props.match.params.project}
                            data={this.state.dataKeywordsByWebsite}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
