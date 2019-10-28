/* eslint-disable */
import React, {PureComponent} from 'react';
import SuggestCurrent from './suggest_current';
import SuggestQuestion from './suggest_questions';
import SuggestPreposition from './suggest_preposition';
import SuggestComparison from './suggest_comparison';
import SuggestAlpha from './suggest_alpha';
import axios from "axios";
import {route, requestUri} from '../../const'
import {Redirect} from "react-router-dom";
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";

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


class SuggestDetails extends PureComponent{
    constructor ()
    {
        super();
        console.error = () => {};
        console.error();
        this.state = {
            data_current: [],
            data_questions: [],
            data_preposition: [],
            data_comparisons: [],
            data_alpha: [],
            loading: true,
            loaded: false,
            redirectSerp: false
        }
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
        axios.get(requestUri + window.location.hostname + route + "/Ajax/Suggest.php", {
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
                keyword: this.props.match.params.keyword,
                value: this.props.location.state !== undefined ? this.props.location.state.value : '',
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
            }
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    } else if (response.data.error && response.data.error === 'Invalid Value') {
                        this.setState({ redirectSerp : !this.state.redirectSerp})
                        NotificationSystem.newInstance({}, n => notification = n);
                        setTimeout(() => showNotification('Error Message', response.data.error, 'danger'), 700);
                    }
                } else {
                    this.setState({
                        data_current: response.data.current,
                        data_questions: response.data.questions,
                        data_preposition: response.data.prepositions,
                        data_comparisons: response.data.comparisons,
                        data_alpha: response.data.alpha,
                        loading: false
                    });
                    setTimeout(() => this.setState({ loaded: true }), 500);
                }
            }
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
        if (this.props.location.state !== undefined) {
            return (
                <div className="dashboard container">
                    {!this.state.loaded &&
                    <div className="panel__refresh">
                        <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                        </svg>
                    </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="page-title">Suggest</h3>
                        </div>
                    </div>
                    <div className="row">
                        <SuggestCurrent data={this.state.data_current}/>
                        <SuggestQuestion data={this.state.data_questions}/>
                        <SuggestPreposition data={this.state.data_preposition}/>
                        <SuggestComparison data={this.state.data_comparisons}/>
                    </div>
                    <SuggestAlpha data={this.state.data_alpha}/>
                </div>
            );
        } else {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
    }
}

export default SuggestDetails;
