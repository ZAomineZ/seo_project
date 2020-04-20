/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import * as classnames from "classnames";
import BarChartTab from "./ComponentWebsite/TabData/BarChartTab";

// Defined array color default for the categories !!!
const dataColor = [
    {color: '#8884d8'},
    {color: '#83a6ed'},
    {color: '#8dd1e1'},
    {color: '#82ca9d'},
    {color: '#a4de6c'},
    {color: '#d0ed57'},
    {color: '#ffc658'},
    {color: '#4ce1b6'},
    {color: '#8D608C'},
    {color: '#FAA945'}
];

export default class TabData extends PureComponent {
    static propTypes = {
        stats: PropTypes.array.isRequired,
        categories: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            categories: []
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.categories) {
            if (nextProps.categories !== {}) {
                let dataCategories = [];
                let categoriesKey = Object.keys(nextProps.categories);

                let categoriesValues = Object.values(nextProps.categories);

                // We created an array via the keys and values to Objects Categories !!!
                categoriesValues.map((value, index) => {
                    dataCategories[index] = {
                        name: categoriesKey[index],
                        percentage: (value) * 100,
                        fill: dataColor[index] ? dataColor[index].color : null
                    }
                });

                // Update State !!!
                this.setState({categories: dataCategories});
            }
        }
    }

    toggle = (tab) => {
        const {activeTab} = this.state;
        if (activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    };

    render() {
        const {activeTab, categories} = this.state;
        const numbro = require('numbro');

        const data = this.props.stats.map(d => {
            return {
                follow: d.follow,
                ip: d.ip,
                ip_subnets: d.ip_subnets,
                nofollow: d.nofollow,
                referring_domain: d.referring_domain,
                referring_pages: d.referring_pages,
                total_backlinks: d.total_backlinks,
            };
        });
        let data_ob = Object.assign({}, data[data.length - 1]);
        let data_numb = Object.assign({}, data);

        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Volume</th>
                        <th>Change</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><p className="bold-text dashboard__btc">Referring Domain</p></td>
                        <td>{numbro(data_ob.referring_domain).format({average: true, mantissa: 2})}</td>
                        <td>
                            {data.length >= 30 && data.length >= 7 ?
                                data_numb[data.length - 30] === undefined ? 0 :
                                    data_numb[data.length - 1].referring_domain - data_numb[data.length - 30].referring_domain > 0
                                        ? "+" + (data_numb[data.length - 1].referring_domain - data_numb[data.length - 30].referring_domain)
                                        : data_numb[data.length - 1].referring_domain - data_numb[data.length - 30].referring_domain < 0
                                        ? data_numb[data.length - 1].referring_domain - data_numb[data.length - 30].referring_domain
                                        : 0
                                : data.length <= 30 && data.length >= 7
                                    ?
                                    data_numb[data.length - 7] === undefined ? 0 :
                                        data_numb[data.length - 1].referring_domain - data_numb[data.length - 7].referring_domain > 0
                                            ? "+" + (data_numb[data.length - 1].referring_domain - data_numb[data.length - 7].referring_domain)
                                            : data_numb[data.length - 1].referring_domain - data_numb[data.length - 7].referring_domain < 0
                                            ? data_numb[data.length - 1].referring_domain - data_numb[data.length - 7].referring_domain
                                            : 0
                                        :
                                    data_numb[data.length - 2] === undefined ? 0 :
                                        data_numb[data.length - 1].referring_domain - data_numb[data.length - 2].referring_domain > 0
                                            ? "+" + (data_numb[data.length - 1].referring_domain - data_numb[data.length - 2].referring_domain)
                                            : data_numb[data.length - 1].referring_domain - data_numb[data.length - 2].referring_domain < 0
                                            ? data_numb[data.length - 1].referring_domain - data_numb[data.length - 2].referring_domain
                                            : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__eth">Referring Pages</p></td>
                        <td>{numbro(data_ob.referring_pages).format({average: true, mantissa: 2})}</td>
                        <td>
                            {data.length >= 30 && data.length >= 7 ?
                                data_numb[data.length - 30] === undefined ? 0 :
                                    data_numb[data.length - 1].referring_pages - data_numb[data.length - 30].referring_pages > 0
                                        ? "+" + (data_numb[data.length - 1].referring_pages - data_numb[data.length - 30].referring_pages)
                                        : data_numb[data.length - 1].referring_pages - data_numb[data.length - 30].referring_pages < 0
                                        ? data_numb[data.length - 1].referring_pages - data_numb[data.length - 30].referring_pages
                                        : 0
                                : data.length <= 30 && data.length >= 7
                                    ?
                                    data_numb[data.length - 7] === undefined ? 0 :
                                        data_numb[data.length - 1].referring_pages - data_numb[data.length - 7].referring_pages > 0
                                            ? "+" + (data_numb[data.length - 1].referring_pages - data_numb[data.length - 7].referring_pages)
                                            : data_numb[data.length - 1].referring_pages - data_numb[data.length - 7].referring_pages < 0
                                            ? data_numb[data.length - 1].referring_pages - data_numb[data.length - 7].referring_pages
                                            : 0
                                    :
                                    data_numb[data.length - 2] === undefined ? 0 :
                                        data_numb[data.length - 1].referring_pages - data_numb[data.length - 2].referring_pages > 0
                                            ? "+" + (data_numb[data.length - 1].referring_pages - data_numb[data.length - 2].referring_pages)
                                            : data_numb[data.length - 1].referring_pages - data_numb[data.length - 2].referring_pages < 0
                                            ? data_numb[data.length - 1].referring_pages - data_numb[data.length - 2].referring_pages
                                            : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__neo">Referring IP</p></td>
                        <td>{numbro(data_ob.ip_subnets).format({average: true, mantissa: 2})}</td>
                        <td>
                            {data.length >= 30 && data.length >= 7 ?
                                data_numb[data.length - 30] === undefined ? 0 :
                                    data_numb[data.length - 1].ip_subnets - data_numb[data.length - 30].ip_subnets > 0
                                        ? "+" + (data_numb[data.length - 1].ip_subnets - data_numb[data.length - 30].ip_subnets)
                                        : data_numb[data.length - 1].ip_subnets - data_numb[data.length - 30].ip_subnets < 0
                                        ? data_numb[data.length - 1].ip_subnets - data_numb[data.length - 30].ip_subnets
                                        : 0
                                : data.length <= 30 && data.length >= 7
                                    ?
                                    data_numb[data.length - 7] === undefined ? 0 :
                                        data_numb[data.length - 1].ip_subnets - data_numb[data.length - 7].ip_subnets > 0
                                            ? "+" + (data_numb[data.length - 1].ip_subnets - data_numb[data.length - 7].ip_subnets)
                                            : data_numb[data.length - 1].ip_subnets - data_numb[data.length - 7].ip_subnets < 0
                                            ? data_numb[data.length - 1].ip_subnets - data_numb[data.length - 7].ip_subnets
                                            : 0
                                    :
                                    data_numb[data.length - 2] === undefined ? 0 :
                                        data_numb[data.length - 1].ip_subnets - data_numb[data.length - 2].ip_subnets > 0
                                            ? "+" + (data_numb[data.length - 1].ip_subnets - data_numb[data.length - 2].ip_subnets)
                                            : data_numb[data.length - 1].ip_subnets - data_numb[data.length - 2].ip_subnets < 0
                                            ? data_numb[data.length - 1].ip_subnets - data_numb[data.length - 2].ip_subnets
                                            : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__ste">Total Backlinks</p></td>
                        <td>{numbro(data_ob.total_backlinks).format({average: true, mantissa: 2})}</td>
                        <td>
                            {data.length >= 30 && data.length >= 7 ?
                                data_numb[data.length - 30] === undefined ? 0 :
                                    data_numb[data.length - 1].total_backlinks - data_numb[data.length - 30].total_backlinks > 0
                                        ? "+" + (data_numb[data.length - 1].total_backlinks - data_numb[data.length - 30].total_backlinks)
                                        : data_numb[data.length - 1].total_backlinks - data_numb[data.length - 30].total_backlinks < 0
                                        ? data_numb[data.length - 1].total_backlinks - data_numb[data.length - 30].total_backlinks
                                        : 0
                                : data.length <= 30 && data.length >= 7
                                    ?
                                    data_numb[data.length - 7] === undefined ? 0 :
                                        data_numb[data.length - 1].total_backlinks - data_numb[data.length - 7].total_backlinks > 0
                                            ? "+" + (data_numb[data.length - 1].total_backlinks - data_numb[data.length - 7].total_backlinks)
                                            : data_numb[data.length - 1].total_backlinks - data_numb[data.length - 7].total_backlinks < 0
                                            ? data_numb[data.length - 1].total_backlinks - data_numb[data.length - 7].total_backlinks
                                            : 0
                                    :
                                    data_numb[data.length - 2] === undefined ? 0 :
                                        data_numb[data.length - 1].total_backlinks - data_numb[data.length - 2].total_backlinks > 0
                                            ? "+" + (data_numb[data.length - 1].total_backlinks - data_numb[data.length - 2].total_backlinks)
                                            : data_numb[data.length - 1].total_backlinks - data_numb[data.length - 2].total_backlinks < 0
                                            ? data_numb[data.length - 1].total_backlinks - data_numb[data.length - 2].total_backlinks
                                            : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__eos">NoFollow</p></td>
                        <td>{numbro(data_ob.nofollow).format({average: true, mantissa: 2})}</td>
                        <td>
                            {data.length >= 30 && data.length >= 7 ?
                                data_numb[data.length - 30] === undefined ? 0 :
                                    data_numb[data.length - 1].nofollow - data_numb[data.length - 30].nofollow > 0
                                        ? "+" + (data_numb[data.length - 1].nofollow - data_numb[data.length - 30].nofollow)
                                        : data_numb[data.length - 1].nofollow - data_numb[data.length - 30].nofollow < 0
                                        ? data_numb[data.length - 1].nofollow - data_numb[data.length - 30].nofollow
                                        : 0
                                : data.length <= 30 && data.length >= 7
                                    ?
                                    data_numb[data.length - 7] === undefined ? 0 :
                                        data_numb[data.length - 1].nofollow - data_numb[data.length - 7].nofollow > 0
                                            ? "+" + (data_numb[data.length - 1].nofollow - data_numb[data.length - 7].nofollow)
                                            : data_numb[data.length - 1].nofollow - data_numb[data.length - 7].nofollow < 0
                                            ? data_numb[data.length - 1].nofollow - data_numb[data.length - 7].nofollow
                                            : 0
                                    :
                                    data_numb[data.length - 2] === undefined ? 0 :
                                        data_numb[data.length - 1].nofollow - data_numb[data.length - 2].nofollow > 0
                                            ? "+" + (data_numb[data.length - 1].nofollow - data_numb[data.length - 2].nofollow)
                                            : data_numb[data.length - 1].nofollow - data_numb[data.length - 2].nofollow < 0
                                            ? data_numb[data.length - 1].nofollow - data_numb[data.length - 2].nofollow
                                            : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__lit">Follow</p></td>
                        <td>{numbro(data_ob.follow).format({average: true, mantissa: 2})}</td>
                        <td>
                            {data.length >= 30 && data.length >= 7 ?
                                data_numb[data.length - 30] === undefined ? 0 :
                                    data_numb[data.length - 1].follow - data_numb[data.length - 30].follow > 0
                                        ? "+" + (data_numb[data.length - 1].follow - data_numb[data.length - 30].follow)
                                        : data_numb[data.length - 1].follow - data_numb[data.length - 30].follow < 0
                                        ? data_numb[data.length - 1].follow - data_numb[data.length - 30].follow
                                        : 0
                                : data.length <= 30 && data.length >= 7
                                    ?
                                    data_numb[data.length - 7] === undefined ? 0 :
                                        data_numb[data.length - 1].follow - data_numb[data.length - 7].follow > 0
                                            ? "+" + (data_numb[data.length - 1].follow - data_numb[data.length - 7].follow)
                                            : data_numb[data.length - 1].follow - data_numb[data.length - 7].follow < 0
                                            ? data_numb[data.length - 1].follow - data_numb[data.length - 7].follow
                                            : 0
                                    :
                                    data_numb[data.length - 2] === undefined ? 0 :
                                        data_numb[data.length - 1].follow - data_numb[data.length - 2].follow > 0
                                            ? "+" + (data_numb[data.length - 1].follow - data_numb[data.length - 2].follow)
                                            : data_numb[data.length - 1].follow - data_numb[data.length - 2].follow < 0
                                            ? data_numb[data.length - 1].follow - data_numb[data.length - 2].follow
                                            : 0
                            }
                        </td>
                    </tr>
                    </tbody>
                </table>
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
                                    Categories
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <BarChartTab data={categories}/>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            </div>
        );
    }
}
