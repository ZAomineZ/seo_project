/* eslint-disable */
import React, {PureComponent} from 'react';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
import BodyFormRank from "./BodyFormRank";
import axios from "axios";
import {route, requestUri} from "../../const";
import RankTop from "./RankTop";
import {Redirect} from "react-router-dom";
import ResponseAjax from "../../js/ResponseAjax";
import Cookie from '../../js/Cookie'
import NotificationMessage from "../../js/NotificationMessage";

export default class RankToIndex extends PureComponent {
    constructor() {
        super();
        console.error = () => {
        };
        console.error();
        this.state = {
            projectData: [],
            keywordsRank: [],
            loading: true,
            loaded: false,
            redirectSerp: false
        };
    }

    RequestAjax() {
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
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + '/Ajax/RankProject.php', {
            headers: headers,
            params: params,
        }).then((response) => {
            if (response.data.error) {
                ResponseAjax.ForbiddenResponse(response);
                this.setState({redirectSerp: !this.state.redirectSerp});
            } else {
                this.setState({
                    projectData: response.data.result,
                    keywordsRank: response.data[0],
                    loading: false
                });
            }
            setTimeout(() => this.setState({loaded: true}), 500);
        })
    }

    componentDidMount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                return NotificationMessage.notification('This Url is invalid !!!', '👋 A Error is present !!!', 'danger');
            }
        }
        return this.isAuth();
    }

    componentWillUnmount() {
        if (this.props.location) {
            if (this.props.location.state !== undefined) {
                notification.destroy();
            }
        }
    }

    isAuth()
    {
        if (sessionStorage.getItem('Auth')) {
            this.RequestAjax();
        } else {
            this.setState({redirectSerp: !this.state.redirectSerp});
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
                            <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                        </svg>
                    </div>
                </div>
                }
                <RankTop/>
                <BodyFormRank name='Add Project' data={this.state.projectData}
                              history={this.props.history}
                              dataKeywordsRank={this.state.keywordsRank}/>
            </div>
        );
    }
}
