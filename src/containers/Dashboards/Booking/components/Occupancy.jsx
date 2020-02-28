/* eslint-disable */
import React, {PureComponent} from 'react';
import {Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {Table} from 'reactstrap';
import Panel from '../../../../shared/components/Panel';
import OccupancyTooltipContent from './OccupancyTooltipContent';
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import * as classnames from "classnames";
import BarChartTab from "../../../../components/Serp/ComponentWebsite/TabData/BarChartTab";

// Defined array color default for the topics !!!
const dataColor = [
    {color: '#8884d8'},
    {color: '#83a6ed'},
    {color: '#8dd1e1'},
    {color: '#82ca9d'},
    {color: '#a4de6c'},
    {color: '#d0ed57'},
    {color: '#ffc658'},
    {color: '#4ce1b6'}
];

class Occupancy extends PureComponent {
    constructor(props)
    {
        super(props);
        this.state = {
            activeTab: '1',
            topics: []
        }
    }

    static propTypes = {
        t: PropTypes.func.isRequired,
        dash_stats: PropTypes.array.isRequired,
        topics: PropTypes.object.isRequired
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.topics) {
            if (nextProps.topics !== {}) {
                let dataTopics = [];
                let topicsKey = Object.keys(nextProps.topics);

                let topicsValues = Object.values(nextProps.topics);

                // We created an array via the keys and values to Objects Categories !!!
                topicsValues.map((value, index) => {
                    dataTopics[index] = {
                        name: topicsKey[index],
                        percentage: (value) * 100,
                        fill: dataColor[index].color
                    }
                });

                // Update State !!!
                this.setState({topics: dataTopics});
            }
        }
    }

    toggle = (tab) => {
        const { activeTab } = this.state;
        if (activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    };

    render() {
        let numbro = require('numbro');

        const {t, dash_stats} = this.props;
        const {activeTab, topics} = this.state;

        return (
            <Panel
                xl={8}
                lg={12}
                md={12}
                title={t('Referring Domains')}
                serpFeature={[]}
                subhead="See how effective your business is"
            >
                <ResponsiveContainer height={260}>
                    <ComposedChart data={dash_stats} margin={{top: 20, left: -15}}>
                        <XAxis dataKey="date" tickLine={false} padding={{left: 20}}/>
                        <YAxis tickLine={false}/>
                        <Tooltip content={<OccupancyTooltipContent colorForKey={{baclinks: '#555555'}}/>}/>
                        <CartesianGrid vertical={false}/>
                        <Bar dataKey="" name="" fill="#f2f4f7" barSize={20}/>
                        <Line type="linear" name="Ip" dataKey="ip" stroke="#b8e986"/>
                        <Line type="linear" name="Referring_domain" dataKey="referring_domain" stroke="#48b5ff"/>
                    </ComposedChart>
                </ResponsiveContainer>
                <hr/>
                <div>
                    <Table responsive className="table dashboard__occupancy-table">
                        <tbody>
                        <tr>
                            <td className="td-head">Date</td>
                            {
                                this.props.dash_stats.map(d => (
                                    <td className="td-gray">{d.date}</td>
                                ))
                            }
                        </tr>
                        <tr>
                            <td className="td-head">Referring_domains</td>
                            {
                                this.props.dash_stats.map(d => (
                                    <td className="td-blue">{numbro(d.referring_domain).format({
                                        average: true,
                                        mantissa: 2
                                    })}</td>
                                ))
                            }
                        </tr>
                        <tr>
                            <td className="td-head">Ip</td>
                            {
                                this.props.dash_stats.map(d => (
                                    <td className="td-green">{numbro(d.ip_subnets).format({
                                        average: true,
                                        mantissa: 2
                                    })}</td>
                                ))
                            }
                        </tr>
                        <tr>
                            <td className="td-head">Backlinks</td>
                            {
                                this.props.dash_stats.map(d => (
                                    <td className="td-gray">{numbro(d.total_backlinks).format({
                                        average: true,
                                        mantissa: 2
                                    })}</td>
                                ))
                            }
                        </tr>
                        </tbody>
                    </Table>
                    <div className="tabs tabs--justify tabs--bordered-top overflow-hidden">
                        <div className="tabs__wrap">
                            <Nav tabs className='tabs_top'>
                                <NavItem>
                                    <NavLink
                                        className={classnames({active: activeTab === '1'})}
                                        onClick={() => {
                                            this.toggle('1');
                                        }}
                                    >
                                        Topics
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <BarChartTab data={topics}/>
                                </TabPane>
                            </TabContent>
                        </div>
                    </div>
                </div>
            </Panel>
        );
    }
}

export default translate('common')(Occupancy);
