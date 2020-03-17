/* eslint-disable */
import React, {PureComponent} from 'react';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import {Card, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from "classnames";
import RankTop from "./Chart/RankTop";

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
                top10: d.top10,
                top3: d.top3,
                volume: Math.round(d.volume)
            }
        });

        return (
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
                                    Top 10
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === '3'})}
                                    onClick={() => {
                                        this.toggle('3');
                                    }}
                                >
                                    Top 3
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({active: this.state.activeTab === '4'})}
                                    onClick={() => {
                                        this.toggle('4');
                                    }}
                                >
                                    Volume
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <div>
                            {
                                this.state.activeTab === '1' ?
                                    <RankTop title={"Top 100 positions keywords (" + this.props.project + ')'}
                                             nameTop='top100'
                                             data={data}
                                             color='#70bbfd'/>
                                    : this.state.activeTab === '2' ?
                                    <RankTop title={"Top 10 positions keywords (" + this.props.project + ')'}
                                             nameTop='top10'
                                             data={data}
                                             color='#F66C7D'/>
                                    : this.state.activeTab === '3' ?
                                        <RankTop title={"Top 3 positions keywords (" + this.props.project + ')'}
                                                 nameTop='top3'
                                                 data={data}
                                                 color='#C093FA'/>
                                        :
                                        <RankTop title={"Volume keywords (" + this.props.project + ')'}
                                                 nameTop='volume'
                                                 data={data}
                                                 color='#4ce1b6'/>
                            }
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

}

export default translate('common')(ChartRank);
