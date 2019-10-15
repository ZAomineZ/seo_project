/* eslint-disable */
import React, {PureComponent} from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import Panel from '../../shared/components/Panel';
import {Card, Col, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import classnames from "classnames";

class ChartRank extends PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired,
        project: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const data = this.props.data.map(d => {
            return {
                name: d.date,
                top100: d.top100,
                volume: Math.round(d.volume)
            }
        });

        return (
            <Col md={12} lg={12} xl={12}>
                <Card>
                    <div className="profile__card tabs tabs--bordered-bottom">
                        <div className="tabs__wrap">
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({active: this.state.activeTab === '1'})}
                                        onClick={() => {
                                            this.toggle('1');
                                        }}
                                    >
                                        Top 100
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({active: this.state.activeTab === '2'})}
                                        onClick={() => {
                                            this.toggle('2');
                                        }}
                                    >
                                        Volume
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <div>
                                {
                                    this.state.activeTab === '1' ?
                                        <Panel xs={12} lg={12}
                                               title={"Top 100 positions keywords (" + this.props.project + ')'}>
                                            <ResponsiveContainer height={300} className="dashboard__area">
                                                <AreaChart data={data} margin={{top: 20, left: -15, bottom: 20}}>
                                                    <XAxis dataKey="name" tickLine={false}/>
                                                    <YAxis tickLine={false} type="number" domain={['auto', 'auto']}
                                                           width={70}/>
                                                    <Tooltip/>
                                                    <Legend/>
                                                    <CartesianGrid/>
                                                    <Area name="top100" type="monotone" dataKey="top100" fill="#70bbfd"
                                                          stroke="#70bbfd" fillOpacity={0.2}/>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </Panel> :
                                        <Panel xs={12} lg={12} title={"Volume keywords (" + this.props.project + ')'}>
                                            <ResponsiveContainer height={300} className="dashboard__area">
                                                <AreaChart data={data} margin={{top: 20, left: -15, bottom: 20}}>
                                                    <XAxis dataKey="name" tickLine={false}/>
                                                    <YAxis tickLine={false} type="number" domain={['auto', 'auto']}
                                                           width={70}/>
                                                    <Tooltip/>
                                                    <Legend/>
                                                    <CartesianGrid/>
                                                    <Area name="volume" type="monotone" dataKey="volume" fill="#4ce1b6"
                                                          stroke="#4ce1b6" fillOpacity={0.2}/>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </Panel>
                                }
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
        );
    }

}

export default translate('common')(ChartRank);
