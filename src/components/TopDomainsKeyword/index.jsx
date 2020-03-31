/* eslint-disable */
import React, { PureComponent } from 'react';
import TabMaterielTopDomains from './TabMaterielTopDomains';
import axios from "axios";
import {route, requestUri} from '../../const'
import {Redirect} from "react-router-dom";
import NavLinkBarTopKeywords from "./Components/NavLinkBarTopKeywords";
import Cookie from "../../js/Cookie";
import NotificationMessage from "../../js/NotificationMessage";

class DomainsKeyword extends PureComponent {
    constructor(props) {
        super(props);
        console.error = () => {};
        console.error();
        this.state = {
            data: [],
            trafficData: [],
            keywordData: [],

            loading: true,
            loaded: false,
            error_message: '',
            redirectSerp: false
        }
    }

    CookieReset (token, id)
    {
        Cookie.CookieReset(token, id);
        this.setState({ redirectSerp : !this.state.redirectSerp})
    }

    NotificationError (response)
    {
        this.setState({ redirectSerp : !this.state.redirectSerp});
        return NotificationMessage.notification(response.data.error, '👋 Danger !!!', 'danger');
    }

    componentDidMount() {
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
            domain: this.props.location.state !== undefined ?
                this.props.location.state.domain :
                this.PropsChange(this.props.match.params.keyword),
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + "/Ajax/TopKeyword.php", {
            headers: headers,
            params: params,
        }).then(response => {
            if (response && response.status === 200) {
                if (response.data === "You have enjoyed more to 5 domain, while the limit 5 !!!") {
                    this.setState({ error_message : response.data })
                } else {
                    if (response.data.error) {
                        if (response.data.error === 'Invalid Token') {
                            this.CookieReset(response.data.token, response.data.id)
                        } else  {
                            return this.NotificationError(response)
                        }
                    } else {
                        if (response.data.length === 0) {
                            this.setState({ redirectSerp : !this.state.redirectSerp});
                            return NotificationMessage.notification('No information was found for this Domain !!!', '👋 Danger !!!', 'danegr');
                        }
                        this.setState({
                            data: response.data.data,
                            trafficData: response.data.trafficData,
                            keywordData: response.data.keywordData,
                            loading: false
                        });
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
                        <NavLinkBarTopKeywords keywordData={this.state.keywordData} trafficData={this.state.trafficData}/>
                        <TabMaterielTopDomains data={this.state.data} keyword={this.props.match.params.keyword}/>
                    </div>
                </div>
            );
        }
  }
}

export default DomainsKeyword;
