/* eslint-disable */
import React, {PureComponent} from 'react';
import {Area, AreaChart, ResponsiveContainer, Tooltip} from 'recharts';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Table} from 'reactstrap';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import DotsHorizontalIcon from 'mdi-react/DotsHorizontalIcon';
import Panel from '../../../../shared/components/Panel';
import MatTableHead from '../../../Tables/MaterialTable/components/MatTableHead';
import MatTableToolbar from '../../../Tables/MaterialTable/components/MatTableToolbar';
import MinimalCollapse from '../../../UI/Collapse/components/MinimalCollapse';
import axios from 'axios';

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
}

const CustomTooltip = ({active, payload}) => {
    if (active) {
        return (
            <div className="dashboard__total-tooltip">
                <p className="label">{`${payload[0].value}`}</p>
            </div>
        );
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

const DropDownMore = ({index, handleDeleteRow, onClick, trust_rank, score_rank, ip_subnets, loaded}) => (
    <UncontrolledDropdown className="dashboard__table-more">
        <DropdownToggle onClick={onClick}>
            <p><DotsHorizontalIcon/></p>
        </DropdownToggle>
        <DropdownMenu className="dropdown__menu">
            <DropdownItem>
                {!loaded &&
                <div className="panel__refresh">
                    <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                    </svg>
                </div>
                }
                <div className="block_flex">
                    <span className="span-style badge-danger">T</span>
                    <span className="span-style badge-danger">R</span>
                    <p className="mr_mdi">
                        {trust_rank}
                    </p>
                </div>
            </DropdownItem>
            <DropdownItem>
                {!loaded &&
                <div className="panel__refresh">
                    <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                    </svg>
                </div>
                }
                <div className="block_flex">
                    <span className="span-style badge-yellow">S</span>
                    <span className="span-style badge-yellow">R</span>
                    <p className="mr_mdi">
                        {score_rank}
                    </p>
                </div>
            </DropdownItem>
            <DropdownItem>
                {!loaded &&
                <div className="panel__refresh">
                    <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                    </svg>
                </div>
                }
                <div className="block_flex">
                    <span className="span-style badge-primary">I</span>
                    <span className="span-style badge-primary">P</span>
                    <p className="mr_mdi">
                        {ip_subnets}
                    </p>
                </div>
            </DropdownItem>
        </DropdownMenu>
    </UncontrolledDropdown>
);

DropDownMore.propTypes = {
    index: PropTypes.number.isRequired,
    handleDeleteRow: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    trust_rank: PropTypes.number,
    score_rank: PropTypes.number,
    ip_subnets: PropTypes.string,
    loaded: PropTypes.bool.isRequired
};

export default class TopTen extends PureComponent {
    static propTypes = {
        onDeleteCryptoTableData: PropTypes.func.isRequired,
        buttonExist: PropTypes.string,
        title: PropTypes.string,
        TopOrLose: PropTypes.bool,
        array_description: PropTypes.array.isRequired,
        array_url: PropTypes.array.isRequired,
        array_rank: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        array_date: PropTypes.array.isRequired,
        keyword: PropTypes.string.isRequired,
        date_comparaison: PropTypes.bool.isRequired,
        state_location: PropTypes.array
    };

    static defaultProps = {
        buttonExist: '',
        title: '',
        TopOrLose: false,
    };

    state = {
        order: 'asc',
        orderBy: 'url',
        data: [],
        data_diff: [],
        selected: [],
        page: 0,
        rowsPerPage: 10,
        loading: true,
        loaded: false
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.array_description !== []) {
            this.setState({
                data: nextProps.array_description.map((d, key) => {
                    let url_title = nextProps.array_url[key];
                    let title = '';
                    if (url_title) {
                        let url_split = url_title.split('www.');
                        if (url_split[1] !== undefined) {
                            let title_split = url_split[1].split('/');
                            title = title_split[0]
                        } else {
                            let url_split = url_title.split('//');
                            if (url_split[1] !== undefined) {
                                let title_split_2 = url_split[1].split('/');
                                title = title_split_2[0]
                            }
                        }
                    }
                    return {
                        id: key + 1,
                        description: d,
                        url: nextProps.array_url[key],
                        title: title
                    }
                }),
                data_diff: Object.entries(nextProps.array_rank).map((d) => {
                    let array = [];
                    for (let i = 0; i <= d[1].length; i++) {
                        array[d[1][i]] = {
                            rank: i + 1,
                            url: d[1][i]
                        }
                    }
                    return array
                }),
            });
        }
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState(state => ({selected: state.data.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    };

    handleClick = (event, id) => {
        const {selected} = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({selected: newSelected});
    };

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage: event.target.value});
    };

    handleDeleteSelected = () => {
        let copyData = [...this.state.data];
        const {selected} = this.state;

        for (let i = 0; i < selected.length; i += 1) {
            copyData = copyData.filter(obj => obj.id !== selected[i]);
        }

        this.setState({data: copyData, selected: []});
    };

    TrustScoreRank = (event, domain, id) => {
        event.preventDefault();
        let route = "ReactProject/App";
        axios.get('http://' + window.location.hostname + route + '/Ajax/SerpTrustScore.php', {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                domain: domain
            }
        }).then((response) => {
            if (response && response.status === 200) {
                this.setState({
                    data: this.state.data.map(d => {
                        if (d.id === id) {
                            return {
                                description: d.description,
                                id: d.id,
                                title: d.title,
                                url: d.url,
                                ip_subnets: response.data.ip_subnets,
                                score_rank: response.data.score_rank,
                                trust_rank: response.data.trust_rank
                            }
                        }
                        return d
                    }),
                    loading: false
                });
                setTimeout(() => this.setState({ loaded: true }), 500);
                this.setState({ loading: true });
                this.setState({ loaded: false });
            }
        });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {
            data, data_diff, order, orderBy, selected, rowsPerPage, page,
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

        return (
            <Panel
                title={this.props.title ? this.props.title : ''}
                button={data_diff[data_diff.length - 2] ? this.props.buttonExist ? this.props.buttonExist : '' : ''}
                keyword={this.props.keyword}
                date_comparaison={this.props.date_comparaison}
                state_location={this.props.state_location}
            >
                <MatTableToolbar
                    numSelected={selected.length}
                    handleDeleteSelected={this.handleDeleteSelected}
                    onRequestSort={this.handleRequestSort}
                />
                <Table className="table table-hover">
                    <MatTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={data.length}
                    />
                    <TableBody>
                        {data
                            .sort(getSorting(order, orderBy))
                            .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                            .map((d, index) => {
                                const isSelected = this.isSelected(d.id);
                                let data_let = [];
                                for (let i = 0; i < data_diff.length; i++) {
                                    let rank_data = data_diff[i][d.url];
                                    if (rank_data === undefined) {
                                        data_let.push({rank: 0, url: d.url});
                                    } else if (rank_data && rank_data.url === d.url) {
                                        data_let.push(rank_data);
                                    }
                                }
                                const data_cr = data_let.map((d) => {
                                    return {
                                        name: d.url,
                                        btc: d.rank
                                    }
                                });
                                return (
                                    <TableRow
                                        className="material-table__row"
                                        role="checkbox"
                                        onClick={event => this.handleClick(event, d.id)}
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        key={d.id}
                                        selected={isSelected}
                                    >
                                        <TableCell className="material-table__cell" padding="checkbox">
                                            <Checkbox checked={isSelected} className="material-table__checkbox"/>
                                        </TableCell>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div>
                                                <div className="block_flex">
                                                    <img
                                                        className="img-icon"
                                                        src={"https://s2.googleusercontent.com/s2/favicons?domain=" + d.title}
                                                        alt=""
                                                    />
                                                    <p className="mr_td">{d.title}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {d.url}
                                            <MinimalCollapse url={d.url} description={d.description} title={d.title}/>
                                        </td>
                                        <td>
                                            <div className="place_flex">
                                                {
                                                    this.props.TopOrLose ?
                                                        data_diff[data_diff.length - 2] ?
                                                        data_diff[data_diff.length - 2][d.url] && data_diff[data_diff.length - 1][d.url] !== undefined
                                                            ? Math.sign((data_diff[data_diff.length - 2][d.url].rank) - (data_diff[data_diff.length - 1][d.url].rank)) !== -1
                                                            ? Math.sign((data_diff[data_diff.length - 2][d.url].rank) - (data_diff[data_diff.length - 1][d.url].rank)) !== 0
                                                                ? svg_green
                                                                : ''
                                                            : svg_red
                                                            : ''
                                                        : ''
                                                            :
                                                        <svg
                                                            className="mdi-icon dashboard_top_serp_icon"
                                                            width="24"
                                                            height="24"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,
                                            7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z"
                                                            />
                                                        </svg>
                                                }
                                                <p className=
                                                       {
                                                           data_diff[data_diff.length - 2] ?
                                                           data_diff[data_diff.length - 2][d.url] && data_diff[data_diff.length - 1][d.url] !== undefined
                                                               ? Math.sign((data_diff[data_diff.length - 2][d.url].rank) - (data_diff[data_diff.length - 1][d.url].rank)) === 0
                                                               ? 'dashboard__total-stat cl_green' : 'dashboard__total-stat' : 'dashboard__total-stat cl_green' : ''}>
                                                    {
                                                        data_diff[data_diff.length - 2] ?
                                                        data_diff[data_diff.length - 2][d.url] && data_diff[data_diff.length - 1][d.url] !== undefined
                                                            ? Math.sign((data_diff[data_diff.length - 2][d.url].rank) - (data_diff[data_diff.length - 1][d.url].rank)) !== -1
                                                            ? Math.sign((data_diff[data_diff.length - 2][d.url].rank) - (data_diff[data_diff.length - 1][d.url].rank)) !== 0
                                                                ? '+' + (data_diff[data_diff.length - 2][d.url].rank) - (data_diff[data_diff.length - 1][d.url].rank)
                                                                : '='
                                                            : (data_diff[data_diff.length - 2][d.url].rank) - (data_diff[data_diff.length - 1][d.url].rank)
                                                            : 'IN' : 'Place not defined'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                        <td className="dashboard__table-crypto-chart">
                                            <ResponsiveContainer height={36} className="dashboard__chart-container">
                                                <AreaChart data={data_cr} margin={{top: 0, left: 0, bottom: 0}}>
                                                    <Tooltip content={<CustomTooltip/>}/>
                                                    <Area
                                                        type="monotone"
                                                        dataKey="btc"
                                                        fill="#4ce1b6"
                                                        stroke="#4ce1b6"
                                                        fillOpacity={0.2}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </td>
                                        <td>
                                            <DropDownMore
                                                index={index}
                                                handleDeleteRow={e => this.props.onDeleteCryptoTableData(index, e)}
                                                onClick={e => this.TrustScoreRank(e, d.title, d.id)}
                                                trust_rank={d.trust_rank}
                                                score_rank={d.score_rank}
                                                ip_subnets={d.ip_subnets}
                                                loaded={this.state.loaded}
                                            />
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
