/* eslint-disable */
import {PureComponent} from "react";
import * as classnames from "classnames";
import Panel from "../../../shared/components/Panel";
import React from "react";
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import TopResultByWebsite from "./TabComponent/TopResultByWebsite";
import PropTypes from "prop-types";
import {TablesListOfWebsites} from "./TabComponent/TablesListOfWebsites";

export default class TabPanelData extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1'
        }
    }

    static propTypes = {
        dataTop3: PropTypes.object.isRequired,
        dataTop5: PropTypes.object.isRequired,
        dataTop10: PropTypes.object.isRequired,
        dataWebsites: PropTypes.array.isRequired,
        methodNewData: PropTypes.func.isRequired
    };

    toggle(tab) {
        const {activeTab} = this.state;
        if (activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const {activeTab} = this.state;
        const {dataTop3, dataTop5, dataTop10, dataWebsites, methodNewData} = this.props;

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
                                    Top Correlation
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: activeTab === '2'})}
                                    onClick={() => {
                                        this.toggle('2');
                                    }}
                                >
                                    Lists of websites
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <TopResultByWebsite dataTop3={dataTop3}
                                                    dataTop5={dataTop5}
                                                    dataTop10={dataTop10}/>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="2">
                                <TablesListOfWebsites data={dataWebsites} methodNewData={methodNewData}/>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </Panel>
        )
    }
}
