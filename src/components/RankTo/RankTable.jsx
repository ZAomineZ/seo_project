/* eslint-disable */
import React, {PureComponent} from 'react';
import {Area, AreaChart, ResponsiveContainer, Tooltip} from 'recharts';
import {Table} from 'reactstrap';
import {Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Panel from '../../shared/components/Panel';
import RankTableHead from "./RankTableHead";
import ReactHtmlParser from "react-html-parser";

const CustomTooltip = ({active, payload}) => {
    if (active && Array.isArray(payload)) {
        if (payload.length !== 0) {
            return (
                <div className="dashboard__total-tooltip">
                    <p className="label">{`${payload[0].value}`}</p>
                </div>
            );
        }
    }

    return null;
};

CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.number,
    })),
};

CustomTooltip.defaultProps = {
    active: false,
    payload: null,
};

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
}

export default class RankTable extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        project: PropTypes.string,
        data: PropTypes.oneOfType([
            PropTypes.array.isRequired,
            PropTypes.object.isRequired
        ]),
        noFeature: PropTypes.bool.isRequired
    };

    static defaultProps = {
        title: '',
    };

    state = {
        data: [],
        page: 0,
        rowsPerPage: 10,
        redirectSerp: false,
        order: 'asc',
        orderBy: ''
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.data) {
            this.setState({data: nextProps.data});
        }
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage: event.target.value});
    };

    SetCookie(name_cookie, value_cookie, expire_days) {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    getCookie(name_cookie) {
        let name = name_cookie + '=';
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let cook = cookie[i];
            while (cook.charAt(0) == ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) == 0) {
                return cook.substring(name.length, cook.length);
            }
            return '';
        }
    }

    CookieReset(token, id) {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({redirectSerp: !this.state.redirectSerp})
    }

    render() {
        const {
            data, rowsPerPage, page, order, orderBy
        } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

        const svg_red = <svg className="mdi-icon dashboard_top_serp_icon"
                             width="24"
                             height="24"
                             fill="currentColor"
                             viewBox="0 0 24 24">
            <path
                d="M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,
                            7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z"/>
        </svg>;
        const svg_green = <svg className="mdi-icon dashboard__trend-icon"
                               width="24"
                               height="24"
                               fill="currentColor"
                               viewBox="0 0 24 24">
            <path
                d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,
                                18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
        </svg>;

        if (this.state.redirectSerp === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }

        if (typeof (this.props.location) == undefined) {
            this.props.location.state = []
        }

        return (
            <Panel
                title={this.props.title ? this.props.title : ''}
                serpFeature={[]}
                keyword={this.props.keyword}
                value={this.props.project}
            >
                <Table className="table table-hover">
                    <RankTableHead
                        order={this.state.order}
                        orderBy={this.state.orderBy}
                        onRequestSort={this.handleRequestSort}
                        noFeature={this.props.noFeature}/>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                            .sort(getSorting(order, orderBy))
                            .map((d) => {
                                return (
                                    <TableRow
                                        className="material-table__row"
                                        tabIndex={-1}
                                        key={d.id}
                                    >
                                        <td>
                                            {d.keyword}
                                        </td>
                                        <td>
                                            <div>
                                                <div className="block_flex">
                                                    <img
                                                        className="img-icon"
                                                        src={"https://s2.googleusercontent.com/s2/favicons?domain=" + d.url}
                                                        alt=""
                                                    />
                                                    <p className="mr_td">{d.url}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {
                                            this.props.noFeature === false &&
                                            <td>
                                                <div className='features-table'>
                                                    {
                                                        d.features.map(d => {
                                                            return (ReactHtmlParser(d))
                                                        })
                                                    }
                                                </div>
                                            </td>
                                        }
                                        <td>
                                            {
                                                d.rank === 'Not Found' ? d.rank : Math.round(d.rank)
                                            }
                                        </td>
                                        <td>
                                            {
                                                d.diff === 'Not Found' ? d.diff : <div className="place_flex">
                                                    {
                                                        d.diff === 0 ? '' :
                                                            Math.sign(d.diff) === 1 ? svg_green : svg_red
                                                    }
                                                    <p className={d.diff === 0 ? 'dashboard__total-stat cl_green' : ''}>
                                                        {
                                                            d.diff === 0 ? '=' :
                                                                Math.sign(d.diff) === 1 ? '+' + d.diff : d.diff
                                                        }
                                                    </p>
                                                </div>
                                            }
                                        </td>
                                        <td>
                                            {
                                                d.volume === 'Not Found' ? d.volume : Math.round(d.volume)
                                            }
                                        </td>
                                        <td className="dashboard__table-crypto-chart">
                                            {
                                                d.chart === 'Not Found' ? d.chart : <ResponsiveContainer height={36}
                                                                                                         className="dashboard__chart-container">
                                                    <AreaChart data={Object.values(d.chart)}
                                                               margin={{top: 0, left: 0, bottom: 0}}>
                                                        <Tooltip content={<CustomTooltip/>}/>
                                                        <Area
                                                            type="monotone"
                                                            dataKey="rank"
                                                            fill="#4ce1b6"
                                                            stroke="#4ce1b6"
                                                            fillOpacity={0.2}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            }
                                        </td>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{height: 49 * emptyRows}}>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    className="material-table__pagination"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{'aria-label': 'Previous Page'}}
                    nextIconButtonProps={{'aria-label': 'Next Page'}}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 20, 30, 50, 100]}
                />
            </Panel>
        );
    }
}
