/* eslint-disable */

import React, { PureComponent } from 'react';
import {ChartTrafficByWebsite} from "./ChartTrafficByWebsite";
import BarTopWebsite from "./BarTopWebsite";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import * as classnames from "classnames";
import Panel from '../../../shared/components/Panel';
import PropTypes from "prop-types";

export default class NavLinkBarTopKeywords extends PureComponent
{
    constructor(props)
    {
        super(props);
        this.state = {
            activeTab: '1'
        }
    }

    static propTypes = {
      keywordData: PropTypes.array.isRequired,
      trafficData: PropTypes.array.isRequired
    };

    toggle(tab)
    {
        const {activeTab} = this.state;
        if (activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const {activeTab} = this.state;
        const {keywordData, trafficData} = this.props;

        return (
            <Panel xs={12} lg={12} md={12} title="Data Keywords" serpFeature={[]}>
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
                                    Top Keywords
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: activeTab === '2'})}
                                    onClick={() => {
                                        this.toggle('2');
                                    }}
                                >
                                    Organic Traffic
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <BarTopWebsite keywordData={keywordData}/>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="2">
                                <ChartTrafficByWebsite trafficData={trafficData}/>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </Panel>
        )
    }
}
