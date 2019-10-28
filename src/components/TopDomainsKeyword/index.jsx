/* eslint-disable */
import React, { PureComponent } from 'react';
import TabMaterielTopDomains from './TabMaterielTopDomains';
import axios from "axios";
import {route, requestUri} from '../../const'
import {Redirect} from "react-router-dom";
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";

let notification = null;

const showNotification = (message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={type === 'danger' ? '👋 Danger !!!' : '👋 Well done !!!'}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class DomainsKeyword extends PureComponent {
    constructor(props) {
        super(props);
        console.error = () => {};
        console.error();
        this.state = {
            data: [],
            loading: true,
            loaded: false,
            error_message: '',
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
        axios.get(requestUri + window.location.hostname + route + "/Ajax/TopKeyword.php", {
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
                domain: this.props.location.state !== undefined ?
                    this.props.location.state.domain :
                    this.PropsChange(this.props.match.params.keyword),
                cookie: this.getCookie('remember_me_auth') ? this.getCookie('remember_me_auth') : this.getCookie('auth_today'),
                auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
            }
        }).then(response => {
            if (response && response.status === 200) {
                if (response.data === "You have enjoyed more to 5 domain, while the limit 5 !!!") {
                    this.setState({ error_message : response.data })
                } else {
                    if (response.data.error) {
                        if (response.data.error === 'Invalid Token') {
                            this.CookieReset(response.data.token, response.data.id)
                        } else if (response.data.error === 'Invalid Value') {
                            this.setState({ redirectSerp : !this.state.redirectSerp});
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                        } else if (response.data.error && response.data.error === 'Limit exceeded !!!') {
                            this.setState({ redirectSerp : !this.state.redirectSerp});
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                        } else if (response.data.error && response.data.error === 'Domain Name does not exist !!!') {
                            this.setState({ redirectSerp : !this.state.redirectSerp});
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification(response.data.error, 'danger'), 700);
                        }
                    } else {
                        if (response.data.length === 0) {
                            this.setState({ redirectSerp : !this.state.redirectSerp});
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification('No information was found for this Domain !!!', 'danger'), 700);
                        }
                        this.setState({ data: response.data, loading: false });
                        setTimeout(() => this.setState({ loaded: true }), 500);
                    }
                }
            }
        })
    }

    PropsChange (string) {
        let str_last =  string.lastIndexOf('-');
        let replace_str = string.slice(0, str_last);
        let replace_str2 = string.slice(str_last, string.length);
        let string_end = replace_str2.replace('-', '.');
        return replace_str + string_end
    }

    render() {
        if (this.state.redirectSerp === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }
        if (this.state.error_message === "You have enjoyed more to 5 domain, while the limit 5 !!!") {
            return (
                <Redirect to={{
                    pathname: '/keyworddomains',
                    state: {error: this.state.error_message}
                }}/>
            );
        } else {
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
                            <h3 className="page-title">Top keyword by Domains</h3>
                        </div>
                    </div>
                    <div className="row">
                        <TabMaterielTopDomains data={this.state.data} keyword={this.props.match.params.keyword}/>
                    </div>
                </div>
            );
        }
  }
}

export default DomainsKeyword;
