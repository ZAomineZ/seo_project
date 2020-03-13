/* eslint-disable */

import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import Panel from "../../../shared/components/Panel";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import * as classnames from "classnames";
import RankTable from "../RankTable";
import axios from 'axios';
import {requestUri, route} from "../../../const";
import Cookie from "../../../js/Cookie";

export default class TabsRankToProject extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            data: [],
            loading: false,
            loaded: true
        }
    }

    static propTypes = {
        project: PropTypes.string.isRequired,
        countKeywords: PropTypes.number.isRequired,
        dataKeywordsByWebsite: PropTypes.array.isRequired
    };

    toggle(tab, typeFeature) {
        const {activeTab} = this.state;
        if (activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }

        if (tab !== '1') {
            return this.getDataRankByFeatures(typeFeature);
        }
    }

    getDataRankByFeatures(typeFeature) {
        this.setState({
            loading: true,
            loaded: false
        });

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
        };

        const {project} = this.props;

        const params = {
            project: project,
            typeFeature: typeFeature,
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + '/Ajax/RankByProjectDataFeature.php', {
            headers: headers,
            params: params
        }).then((response) => {
            if (response.data.success) {
                // CODE
                let data = Object.values(response.data.data);
                this.setState({
                    data: data,
                    loading: false
                });

                setTimeout(() => this.setState({loaded: true}), 500);
            }
        })
    }

    render() {
        const {activeTab, data} = this.state;
        const {project, countKeywords, dataKeywordsByWebsite} = this.props;

        return (
            <Panel xs={12} lg={12} md={12} title="Data Keywords" serpFeature={[]}>
                {!this.state.loaded &&
                <div className="panel__refresh">
                    <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                    </svg>
                </div>
                }
                <div className="tabs tabs--justify tabs--bordered-top overflow-hidden">
                    <div className="tabs__wrap">
                        <Nav tabs className='tabs--bordered-top'>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: activeTab === '1'})}
                                    onClick={() => {
                                        this.toggle('1');
                                    }}
                                >
                                    Organic
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: activeTab === '2'})}
                                    onClick={() => {
                                        this.toggle('2', 'images');
                                    }}
                                >
                                    Images
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: activeTab === '3'})}
                                    onClick={() => {
                                        this.toggle('3', 'videos');
                                    }}
                                >
                                    Videos
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: activeTab === '4'})}
                                    onClick={() => {
                                        this.toggle('4', 'P0');
                                    }}
                                >
                                    P0
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <RankTable
                                    title={'Dashboard Rank Keyword (' + countKeywords + ')'}
                                    project={project}
                                    data={dataKeywordsByWebsite}
                                    noFeature={false} />
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="2">
                                <RankTable
                                    title={'Dashboard Rank Keyword (' + countKeywords + ')'}
                                    project={project}
                                    data={data}
                                    noFeature={true} />
                            </TabPane>
                            <TabPane tabId="3">
                                <RankTable
                                    title={'Dashboard Rank Keyword (' + countKeywords + ')'}
                                    project={project}
                                    data={data}
                                    noFeature={true} />
                            </TabPane>
                            <TabPane tabId="4">
                                <RankTable
                                    title={'Dashboard Rank Keyword (' + countKeywords + ')'}
                                    project={project}
                                    data={data}
                                    noFeature={true} />
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </Panel>
        )
    }
}
