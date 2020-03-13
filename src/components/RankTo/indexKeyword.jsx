/* eslint-disable */
import React, {PureComponent} from "react";
import ChartRank from "./ChartRank";
import axios from "axios";
import {route, requestUri} from "../../const";
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import {Redirect} from "react-router-dom";
import TabsRankToProject from "./Tabs/TabsRankToProject";
import Cookie from "../../js/Cookie";
import ResponseAjax from "../../js/ResponseAjax";

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
        console.error = () => {};
        console.error();
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

    submitNotification(type, title, message) {
        NotificationSystem.newInstance({}, n => notification = n);
        setTimeout(() => showNotification(type, title, message), 700);
    }

    componentDidMount() {
        if (sessionStorage.getItem('Auth')) {
            let project = this.props.match.params.project;
            if (project !== '') {
                axios.get( requestUri + window.location.hostname + route + '/Ajax/RankByProject.php', {
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
                        cookie: Cookie.getCookie('remember_me_auth') ?
                            Cookie.getCookie('remember_me_auth') :
                            Cookie.getCookie('auth_today'),
                        auth: sessionStorage.getItem('Auth') ?
                            sessionStorage.getItem('Auth')
                            : ''
                    }
                }).then((response) => {
                    if (response && response.status === 200) {
                        if (response.data.error) {
                            if (response.data.error === 'Invalid Token') {
                                return this.redirectSerp(response);
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
        } else {
            this.setState({redirectSerp: !this.state.redirectSerp});
        }
    }

    /**
     * @param {object} response
     */
    redirectSerp(response){
        ResponseAjax.ForbiddenResponse(response);
        this.setState({redirectSerp: !this.state.redirectSerp});
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
                        <TabsRankToProject project={this.props.match.params.project}
                                           countKeywords={this.state.countKeywords}
                                           dataKeywordsByWebsite={this.state.dataKeywordsByWebsite} />
                    </div>
                </div>
            </div>
        );
    }
}
