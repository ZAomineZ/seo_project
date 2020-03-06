/* eslint-disable */
import {PureComponent} from "react";
import Nav from "reactstrap/src/Nav";
import NavItem from "reactstrap/src/NavItem";
import NavLink from "reactstrap/src/NavLink";
import * as classnames from "classnames";
import TabContent from "reactstrap/src/TabContent";
import TabPane from "reactstrap/src/TabPane";
import BarTopWebsite from "../../TopDomainsKeyword/Components/BarTopWebsite";
import {ChartTrafficByWebsite} from "../../TopDomainsKeyword/Components/ChartTrafficByWebsite";
import Panel from "../../../shared/components/Panel";
import React from "react";

export default class TabPanelData extends PureComponent
{
    constructor(props)
    {
        super(props)
    }

    render() {
        const {activeTab} = this.state;
        
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
