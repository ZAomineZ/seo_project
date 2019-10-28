/* eslint-disable */
import React, {PureComponent} from 'react';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
import BodyFormRank from "./BodyFormRank";
import axios from "axios";
import {route, requestUri} from "../../const";
import RankTop from "./RankTop";
import {Redirect} from "react-router-dom";

let notification = null;

const showNotification = (message) => {
    notification.notice({
        content: <BasicNotification
            color="danger"
            title="👋 A Error is present !!!"
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

export default class RankToIndex extends PureComponent {
    constructor() {
        super();
        console.error = () => {};
        console.error();
        this.state = {
            projectData: [],
            keywordsRank: [],
            loading: true,
            loaded: false,
            redirectSerp: false
        };
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
        this.setState({redirectSerp: !this.state.redirectSerp});
    }

    RequestAjax() {
        axios.get(requestUri + window.location.hostname + route + '/Ajax/RankProject.php', {
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
                cookie: this.getCookie('remember_me_auth') ?
                    this.getCookie('remember_me_auth') :
                    this.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ?
                    sessionStorage.getItem('Auth')
                    : ''
            }
        }).then((response) => {
            if (response.data.error) {
                if (response.data.error === 'Invalid Token') {
                    this.CookieReset(response.data.token, response.data.id)
                }
            } else {
                this.setState({
                    projectData: response.data.result,
                    keywordsRank: response.data[0],
                    loading: false
                });
            }
            setTimeout(() => this.setState({ loaded: true }), 500);
        })
    }

    componentDidMount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification('This Url is invalid !!!'), 700);
            }
        }
        if (sessionStorage.getItem('Auth')) {
            this.RequestAjax();
        } else {
            this.setState({redirectSerp: !this.state.redirectSerp});
        }
    }

    componentWillUnmount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                notification.destroy();
            }
        }
    }

    render() {
        if (this.state.redirectSerp) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            )
        }
        return (
            <div className="dashboard container">
                {!this.state.loaded &&
                <div className={`load${this.state.loading ? '' : ' loaded'}`}>
                    <div className="load__icon-wrap">
                        <svg className="load__icon">
                            <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                        </svg>
                    </div>
                </div>
                }
                <RankTop />
                <BodyFormRank name='Add Project' data={this.state.projectData}
                              dataKeywordsRank={this.state.keywordsRank}/>
            </div>
        );
    }
}
