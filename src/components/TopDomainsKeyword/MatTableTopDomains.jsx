/* eslint-disable */
import React, {PureComponent} from 'react';
import {Card, CardBody, UncontrolledTooltip} from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import MatTableHead from './MatTableHeadTopDomains';
import MatTableToolbarTopDomain from './MatTableToolbarTopDomain';
import axios from "axios";
import {requestUri, route} from "../../const";
import {Redirect} from "react-router-dom";
import TableKeywords from "./Components/KeywordsComponent/TableKeywords";
import Cookie from "../../js/Cookie";
import NotificationMessage from "../../js/NotificationMessage";

let counter = 0;

function createData(domains, traffic, top3, top4a10, top11a20, top21a50) {
    counter += 1;
    return {
        id: counter, domains, traffic, top3, top4a10, top11a20, top21a50,
    };
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
}

const svg_red =
    <svg
        className="mdi-icon dashboard_top_serp_icon"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            d="M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,
              6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z"
        />
    </svg>;

const svg_green =
    <svg
        className="mdi-icon dashboard__trend-icon"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,
                  16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"
        />
    </svg>;

export default class MatTable extends PureComponent {
    static propTypes = {
        data: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired,
        keyword: PropTypes.string.isRequired
    };

    state = {
        order: 'asc',
        orderBy: 'domains',
        selected: [],

        dataNow: [],
        dataLastMonth: [],
        dataKeywords: [],
        pagesPagination: 0,
        currentPag: 1,
        intervalElement: [],
        paginationNumber: [],
        domain: '',

        paginationFilter: false,
        filterValue: '',
        filterLabel: '',

        page: 0,
        rowsPerPage: 5,
        filter: "",

        redirectSerp: false,
        loadedBtn: true,
        loadedKeywords: true
    };

    constructor(props) {
        super(props);
        this.handleClickOpenTable = this.handleClickOpenTable.bind(this);
        this.ajaxCsvKeywords = this.ajaxCsvKeywords.bind(this);
        this.onHandleFilterRank = this.onHandleFilterRank.bind(this);
        this.onHandleFilterVolume = this.onHandleFilterVolume.bind(this);
        this.onHandleFilterUrl = this.onHandleFilterUrl.bind(this);
        this.paginationKeywords = this.paginationKeywords.bind(this)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.data.length !== 0) {
            const arrayDataNow = [];
            const arrayDataLastMonth = [];

            let data = Object.values(nextProps.data);

            data.map((value, index) => {
                value = Object.values(value);

                arrayDataNow[index] = {
                    date: value[value.length - 1].date,
                    domain: value[value.length - 1].domain,

                    top_3: value[value.length - 1].top_3,
                    top_4_10: value[value.length - 1].top_4_10,
                    top_11_20: value[value.length - 1].top_11_20,
                    top_21_50: value[value.length - 1].top_21_50,
                    top_51_100: value[value.length - 1].top_51_100,
                    traffic: value[value.length - 1].traffic,

                    diff_top_3: value[value.length - 2]
                        ? (value[value.length - 1].top_3 - value[value.length - 2].top_3)
                        : undefined,
                    diff_top_4_10: value[value.length - 2]
                        ? (value[value.length - 1].top_4_10 - value[value.length - 2].top_4_10)
                        : undefined,
                    diff_top_11_20: value[value.length - 2]
                        ? (value[value.length - 1].top_11_20 - value[value.length - 2].top_11_20)
                        : undefined,
                    diff_top_21_50: value[value.length - 2]
                        ? (value[value.length - 1].top_21_50 - value[value.length - 2].top_21_50)
                        : undefined,
                    diff_top_51_100: value[value.length - 2]
                        ? (value[value.length - 1].top_51_100 - value[value.length - 2].top_51_100)
                        : undefined,
                    diff_traffic: value[value.length - 2]
                        ? (value[value.length - 1].traffic - value[value.length - 2].traffic)
                        : undefined
                };

                arrayDataLastMonth[index] = {
                    date: value[value.length - 2] ? value[value.length - 2].date : 0,
                    domain: value[value.length - 2] ? value[value.length - 2].domain : 0,

                    top_3: value[value.length - 2] ? value[value.length - 2].top_3 : 0,
                    top_4_10: value[value.length - 2] ? value[value.length - 2].top_4_10 : 0,
                    top_11_20: value[value.length - 2] ? value[value.length - 2].top_11_20 : 0,
                    top_21_50: value[value.length - 2] ? value[value.length - 2].top_21_50 : 0,
                    top_51_100: value[value.length - 2] ? value[value.length - 2].top_51_100 : 0,
                    traffic: value[value.length - 2] ? value[value.length - 2].traffic : 0,
                }
            });

            this.setState({
                dataNow: arrayDataNow,
                dataLastMonth: arrayDataLastMonth
            });
        }
    }

    handleChange(event) {
        this.setState({filter: event.target.value})
    }

    searchingFor(filter) {
        return function (item) {
            return item.domain.toLowerCase().includes(filter.toLowerCase()) || !filter
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

    CookieReset(token, id) {
        Cookie.CookieReset(token, id);
        this.setState({redirectSerp: !this.state.redirectSerp})
    }

    Download(event, data) {
        event.preventDefault();

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        const params = {
            data: data,
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + "/Ajax/TopKeywordCsv.php", {
            headers: headers,
            params: params,
        }).then(response => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        this.CookieReset(response.data.token, response.data.id)
                    }
                } else {
                    window.location.href = response.request.responseURL;
                }
            }
        })
    }

    DownloadKeywords(event) {
        event.preventDefault();
        this.setState({loadedBtn: false});

        let domains = this.props.keyword;
        let page = '/Ajax/TopKeyword/CSV/KeywordCsvDownload.php';

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        const params = {
            domains: domains,
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + page, {
            headers: headers,
            params: params
        }).then(response => {
            if (response && response.status === 200) {
                if (response.data.error) {
                    if (response.data.error === 'Invalid Token') {
                        return this.CookieReset(response.data.token, response.data.id)
                    }
                } else {
                    this.setState({loadedBtn: true});
                    window.location.href = response.request.responseURL;
                }
            }
        })
    }

    ajaxCsvKeywords(e, domain) {
        e.preventDefault();

        this.setState({loadedKeywords: false});
        this.setState({
            filterValue: '',
            filterLabel: '',
            paginationFilter: false
        });

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        const params = {
            domain: domain,
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + "/Ajax/TopKeyword/KeywordsAll.php", {
            headers: headers,
            params: params
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.success) {
                    let data = response.data.data ? Object.values(response.data.data) : [];
                    let pages = response.data.pages ? response.data.pages : 0;
                    let intervalElement = response.data.intervalElement ? response.data.intervalElement : [0, 99];
                    let currentPage = response.data.currentPage ? response.data.currentPage : 1;
                    let paginationNumber = response.data.paginationNumber ? response.data.paginationNumber : [1, 2, 3];

                    this.setState({
                        dataKeywords: data,
                        pagesPagination: pages,
                        currentPage: currentPage,
                        intervalElement: intervalElement,
                        paginationNumber: paginationNumber,
                        domain: domain,
                        filterValue: '',
                        filterLabel: '',
                    });
                    setTimeout(() => this.setState({loadedKeywords: true}), 500);
                } else {
                    setTimeout(() => this.setState({loadedKeywords: true}), 500);
                    return NotificationMessage.notification(response.data.error, 'Error Message', 'danger');
                }
            }
        })
    }

    paginationKeywords(event, page, offset, pageRemoveIndex) {
        event.preventDefault();

        this.setState({loadedKeywords: false});

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        let formData = new FormData();
        formData.set('domain', this.state.domain);
        formData.set('offset', offset);
        formData.set('page', page);
        formData.set('pageRemoveIndex', pageRemoveIndex);
        formData.set('cookie', Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'));
        formData.set('auth', sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '');

        if (this.state.paginationFilter) {
            formData.set('filter', this.state.filterValue);
            formData.set('keyFilter', this.state.filterLabel);
        }

        let filePagination = this.state.paginationFilter ? 'KeywordFilterPagination.php' : 'KeywordPagination.php';

        axios.post(requestUri + window.location.hostname + route + "/Ajax/TopKeyword/" + filePagination, formData,
            {headers: headers})
            .then((response) => {
                if (response && response.status === 200) {
                    if (response.data.success) {
                        let data = response.data.data ? Object.values(response.data.data) : [];
                        let pages = response.data.pages ? response.data.pages : 0;
                        let intervalElement = response.data.intervalElement ? response.data.intervalElement : [0, 99];
                        let currentPage = response.data.currentPage ? response.data.currentPage : 1;
                        let paginationNumber = response.data.paginationNumber ? response.data.paginationNumber : [1, 2, 3];

                        this.setState({
                            dataKeywords: data,
                            pagesPagination: pages,
                            currentPage: currentPage,
                            intervalElement: intervalElement,
                            paginationNumber: paginationNumber
                        });
                        setTimeout(() => this.setState({loadedKeywords: true}), 500);
                    }
                }
            })
    }

    onHandleFilter(e, page, filter) {
        e.preventDefault();

        this.setState({loadedKeywords: false});

        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        const params = {
            domain: this.state.domain,
            filter: filter,
            cookie: Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'),
            auth: sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : ''
        };

        axios.get(requestUri + window.location.hostname + route + "/Ajax/TopKeyword/" + page, {
            headers: headers,
            params: params
        }).then((response) => {
            if (response && response.status === 200) {
                if (response.data.success === true) {
                    let data = response.data.data ? Object.values(response.data.data) : [];
                    let pages = response.data.pages ? response.data.pages : 0;
                    let intervalElement = response.data.intervalElement ? response.data.intervalElement : [0, 99];
                    let currentPage = response.data.currentPage ? response.data.currentPage : 1;
                    let paginationNumber = response.data.paginationNumber ? response.data.paginationNumber : [1, 2, 3];
                    let filter = response.data.filter ? response.data.filter : '';
                    let filterKey = response.data.filterKey ? response.data.filterKey : '';

                    this.setState({
                        dataKeywords: data,
                        pagesPagination: pages,
                        currentPage: currentPage,
                        intervalElement: intervalElement,
                        paginationNumber: paginationNumber,
                        paginationFilter: true,
                        filterValue: filter,
                        filterLabel: filterKey
                    });
                    setTimeout(() => this.setState({loadedKeywords: true}), 500);
                }
            }
        })
    }

    onHandleFilterRank(e, filter) {
        return this.onHandleFilter(e, 'KeywordFilterByRank.php', filter)
    }

    onHandleFilterVolume(e, filter) {
        return this.onHandleFilter(e, 'KeywordFilterByVolume.php', filter)
    }

    onHandleFilterUrl(e, filterUrl) {
        return this.onHandleFilter(e, 'KeywordFilterByUrl.php', filterUrl)
    }

    handleClickOpenTable(e, websiteIndex) {
        e.preventDefault();

        let trRow = document.querySelector('#row-' + websiteIndex);
        let allTrRow = document.querySelectorAll('.MuiTableRow-root-20.material-table__row');
        let trKeyword = document.querySelector('#tr-keywords');
        let dataDomain = trRow.getAttribute('data-domain');

        trRow.after(trKeyword);

        let dataTrActive = trRow.getAttribute('data-active');

        allTrRow.forEach(value => {
            if (value !== trRow) {
                value.setAttribute('data-active', 'no-active');
            }
        });

        this.setState({});
        if (dataTrActive === 'no-active') {
            trKeyword.classList.remove('d-none');
            trRow.setAttribute('data-active', 'active');

            return this.ajaxCsvKeywords(e, dataDomain);
        } else {
            trKeyword.classList.add('d-none');
            trRow.setAttribute('data-active', 'no-active');

            return false;
        }
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {
            dataNow, dataLastMonth, dataKeywords, pagesPagination, currentPage, intervalElement, paginationNumber,
            filterValue, filterLabel, loadedKeywords, order, orderBy, selected, filter, domain, loadedBtn
        } = this.state;

        if (this.state.redirectSerp === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            );
        }

        return (
            <Card>
                <CardBody className="card_body_pt-20">
                    <div className="card__title">
                        <h5 className="bold-text">Top Domains</h5>
                        <div className="pt-5">
                            <button onClick={e => this.Download(e, dataNow)} className="btn btn-primary">Download
                                CSV
                            </button>
                            <button onClick={e => this.Download(e, dataLastMonth)} className="btn btn-primary">Download
                                CSV last month
                            </button>
                            <button onClick={e => this.DownloadKeywords(e)} className="btn btn-primary">Download
                                {!loadedBtn &&
                                <div className='panel__refresh panel-refresh-custom'>
                                    <svg className="mdi-icon icon-right" width="24" height="24" fill="currentColor"
                                         viewBox="0 0 24 24" style={{left: '20px'}}>
                                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                                    </svg>
                                </div>
                                }
                                All keywords
                            </button>
                        </div>
                    </div>
                    <MatTableToolbarTopDomain
                        numSelected={selected.length}
                        handleDeleteSelected={this.handleDeleteSelected}
                        onRequestSort={this.handleRequestSort}
                        onChange={e => this.handleChange(e)}
                        value={filter}
                    />
                    <div className="material-table__wrap table_style">
                        <Table className="material-table">
                            <MatTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                rowCount={dataNow.length}
                            />
                            <TableBody>
                                {dataNow.filter(this.searchingFor(filter))
                                    .sort(getSorting(order, orderBy))
                                    .map((d, index) => {
                                        const isSelected = this.isSelected(d.id);

                                        return (
                                            <TableRow
                                                className="material-table__row"
                                                role="checkbox"
                                                aria-checked={isSelected}
                                                tabIndex={-1}
                                                key={d.id}
                                                data-domain={d.domain}
                                                data-active='no-active'
                                                id={'row-' + (index + 1)}
                                                onClick={e => this.handleClickOpenTable(e, (index + 1))}
                                                selected={isSelected}
                                            >
                                                <TableCell className="material-table__cell font-default-size">
                                                    {d.domain}
                                                </TableCell>
                                                <TableCell className="material-table__cell">
                                                    <div
                                                        className="dashboard__total"
                                                    >
                                                        <p className="">{d.traffic}</p>
                                                        {
                                                            d.diff_traffic !== undefined && d.traffic !== 0 ?
                                                                d.diff_traffic !== 0 ?
                                                                    Math.sign(d.diff_traffic) === -1 ?
                                                                        svg_red : svg_green
                                                                    : ''
                                                                : ''
                                                        }
                                                        <p>
                                                            {
                                                                d.diff_traffic !== undefined && d.traffic !== 0 ?
                                                                    d.diff_traffic !== 0 ?
                                                                        Math.sign(d.diff_traffic) === -1 ?
                                                                            d.diff_traffic
                                                                            : '+' + (d.diff_traffic) : ''
                                                                    : ''
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="material-table__cell">
                                                    <div
                                                        className="dashboard__total"
                                                    >
                                                        <p className="">{d.top_3}</p>
                                                        {
                                                            d.diff_top_3 !== undefined && d.top_3 !== 0 ?
                                                                d.diff_top_3 !== 0 ?
                                                                    Math.sign(d.diff_top_3) === -1 ?
                                                                        svg_red : svg_green
                                                                    : ''
                                                                : ''
                                                        }
                                                        <p>
                                                            {
                                                                d.diff_top_3 !== undefined && d.top_3 !== 0 ?
                                                                    d.diff_top_3 !== 0 ?
                                                                        Math.sign(d.diff_top_3) === -1 ?
                                                                            d.diff_top_3
                                                                            : '+' + (d.diff_top_3)
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="material-table__cell">
                                                    <div
                                                        className="dashboard__total"
                                                    >
                                                        <p className="">{d.top_4_10}</p>
                                                        {
                                                            d.diff_top_4_10 !== undefined && d.top_4_10 !== 0 ?
                                                                d.diff_top_4_10 !== 0 ?
                                                                    Math.sign(d.diff_top_4_10) === -1 ?
                                                                        svg_red : svg_green
                                                                    : ''
                                                                : ''
                                                        }
                                                        <p>{
                                                            d.diff_top_4_10 !== undefined && d.top_4_10 !== 0 ?
                                                                d.diff_top_4_10 !== 0 ?
                                                                    Math.sign(d.diff_top_4_10) === -1 ?
                                                                        d.diff_top_4_10
                                                                        : '+' + (d.diff_top_4_10)
                                                                    : ''
                                                                : ''
                                                        }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="material-table__cell">
                                                    <div
                                                        className="dashboard__total"
                                                    >
                                                        <p className="">{d.top_11_20}</p>
                                                        {
                                                            d.diff_top_11_20 !== undefined && d.top_11_20 !== 0 ?
                                                                d.diff_top_11_20 !== 0 ?
                                                                    Math.sign(d.diff_top_11_20) === -1 ?
                                                                        svg_red : svg_green
                                                                    : ''
                                                                : ''
                                                        }
                                                        <p>
                                                            {
                                                                d.diff_top_11_20 !== undefined && d.top_11_20 !== 0 ?
                                                                    d.diff_top_11_20 !== 0 ?
                                                                        Math.sign(d.diff_top_11_20) === -1 ?
                                                                            d.diff_top_11_20
                                                                            : '+' + (d.diff_top_11_20)
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="material-table__cell">
                                                    <div
                                                        className="dashboard__total"
                                                    >
                                                        <p className="">{d.top_21_50}</p>
                                                        {
                                                            d.diff_top_21_50 !== undefined && d.top_21_50 !== 0 ?
                                                                d.diff_top_21_50 !== 0 ?
                                                                    Math.sign(d.diff_top_21_50) === -1 ?
                                                                        svg_red : svg_green
                                                                    : ''
                                                                : ''
                                                        }
                                                        <p>
                                                            {
                                                                d.diff_top_21_50 !== undefined && d.top_21_50 !== 0 ?
                                                                    d.diff_top_21_50 !== 0 ?
                                                                        Math.sign(d.diff_top_21_50) === -1 ?
                                                                            d.diff_top_21_50
                                                                            : '+' + (d.diff_top_21_50)
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="material-table__cell">
                                                    <div
                                                        className="dashboard__total"
                                                    >
                                                        <p className="">{d.top_51_100}</p>
                                                        {
                                                            d.diff_top_51_100 !== undefined && d.top_51_100 !== 0 ?
                                                                d.diff_top_51_100 !== 0 ?
                                                                    Math.sign(d.diff_top_51_100) === -1 ?
                                                                        svg_red : svg_green
                                                                    : ''
                                                                : ''
                                                        }
                                                        <p>
                                                            {
                                                                d.diff_top_51_100 !== undefined && d.top_51_100 !== 0 ?
                                                                    d.diff_top_51_100 !== 0 ?
                                                                        Math.sign(d.diff_top_51_100) === -1 ?
                                                                            d.diff_top_51_100
                                                                            : '+' + (d.diff_top_51_100)
                                                                        : ''
                                                                    : ''
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <UncontrolledTooltip placement="top" target={'row-' + (index + 1)}>
                                                    Click here to see domain keywords
                                                </UncontrolledTooltip>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                        <TableKeywords dataKeywords={dataKeywords}
                                       paginationKeywords={this.paginationKeywords}
                                       onHandleFilterRank={this.onHandleFilterRank}
                                       onHandleFilterVolume={this.onHandleFilterVolume}
                                       onHandleFilterUrl={this.onHandleFilterUrl}
                                       ajaxCsvKeywords={e => this.ajaxCsvKeywords(e, domain)}
                                       pagesPagination={pagesPagination}
                                       currentPage={currentPage}
                                       intervalElement={intervalElement}
                                       paginationNumber={paginationNumber}
                                       filterValue={filterValue}
                                       filterLabel={filterLabel}
                                       loaded={loadedKeywords}/>
                    </div>
                </CardBody>
            </Card>
        );
    }
}
