/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

export default class TabData extends PureComponent {
    static propTypes = {
        stats: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
    }

    render() {
        let numbro = require('numbro');

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
        let data_ob = Object.assign({}, data[data.length -1]);
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
                        <td>{ numbro(data_ob.referring_domain).format({average: true, mantissa: 2}) }</td>
                        <td>
                            { data[data.length -2] === undefined
                                ? ''
                                : data_numb[data.length - 2].referring_domain - data_numb[data.length - 1].referring_domain > 0
                                ? "+" + (data_numb[data.length - 2].referring_domain - data_numb[data.length - 1].referring_domain)
                                : data_numb[data.length - 2].referring_domain - data_numb[data.length - 1].referring_domain < 0
                                ? data_numb[data.length - 2].referring_domain - data_numb[data.length - 1].referring_domain
                                : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__eth">Referring Pages</p></td>
                        <td>{ numbro(data_ob.referring_pages).format({average: true, mantissa: 2}) }</td>
                        <td>
                            { data[data.length -2] === undefined
                                ? ''
                                : data_numb[data.length - 2].referring_pages - data_numb[data.length - 1].referring_pages > 0
                                ? "+" + (data_numb[data.length - 2].referring_pages - data_numb[data.length - 1].referring_pages)
                                : data_numb[data.length - 2].referring_pages - data_numb[data.length - 1].referring_pages < 0
                                ? data_numb[data.length - 2].referring_pages - data_numb[data.length - 1].referring_pages
                                : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__neo">IP (Subnets)</p></td>
                        <td>{ numbro(data_ob.ip).format({average: true, mantissa: 2}) } ({ numbro(data_ob.ip_subnets).format({average: true, mantissa: 2})})</td>
                        <td>
                            { data[data.length -2] === undefined
                                ? ''
                                : data_numb[data.length - 2].ip - data_numb[data.length - 1].ip > 0
                                ? "+" + (data_numb[data.length - 2].ip - data_numb[data.length - 1].ip)
                                : data_numb[data.length - 2].ip - data_numb[data.length - 1].ip < 0
                                ? data_numb[data.length - 2].ip - data_numb[data.length - 1].ip
                                : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__ste">Total Backlinks</p></td>
                        <td>{ numbro(data_ob.total_backlinks).format({average: true, mantissa: 2}) }</td>
                        <td>
                            { data[data.length -2] === undefined
                                ? ''
                                : data_numb[data.length - 2].total_backlinks - data_numb[data.length - 1].total_backlinks > 0
                                ? "+" + (data_numb[data.length - 2].total_backlinks - data_numb[data.length - 1].total_backlinks)
                                : data_numb[data.length - 2].total_backlinks - data_numb[data.length - 1].total_backlinks < 0
                                ? data_numb[data.length - 2].total_backlinks - data_numb[data.length - 1].total_backlinks
                                : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__eos">NoFollow</p></td>
                        <td>{ numbro(data_ob.nofollow).format({average: true, mantissa: 2}) }</td>
                        <td>
                            { data[data.length -2] === undefined
                                ? ''
                                : data_numb[data.length - 2].nofollow - data_numb[data.length - 1].nofollow > 0
                                ? "+" + (data_numb[data.length - 2].nofollow - data_numb[data.length - 1].nofollow)
                                : data_numb[data.length - 2].nofollow - data_numb[data.length - 1].nofollow < 0
                                ? data_numb[data.length - 2].nofollow - data_numb[data.length - 1].nofollow
                                : 0
                            }
                        </td>
                    </tr>
                    <tr>
                        <td><p className="bold-text dashboard__lit">Follow</p></td>
                        <td>{ numbro(data_ob.follow).format({average: true, mantissa: 2}) }</td>
                        <td>
                            { data[data.length -2] === undefined
                                ? ''
                                : data_numb[data.length - 2].follow - data_numb[data.length - 1].follow > 0
                                ? "+" + (data_numb[data.length - 2].follow - data_numb[data.length - 1].follow)
                                : data_numb[data.length - 2].follow - data_numb[data.length - 1].follow < 0
                                ? data_numb[data.length - 2].follow - data_numb[data.length - 1].follow
                                : 0
                            }
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
