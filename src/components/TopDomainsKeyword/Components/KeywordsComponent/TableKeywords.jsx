/* eslint-disable */
import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Progress,
    UncontrolledDropdown
} from "reactstrap";
import {mdiGoogleAnalytics} from '@mdi/js';
import {ChevronDownIcon} from "mdi-react";
import Icon from '@mdi/react'
import {Link} from "react-router-dom";
import {Pagination} from "./Pagination";

const buttonRankSort = [
    {value: 10, label: 'Top 10'},
    {value: 20, label: 'Top 20'},
    {value: 30, label: 'Top 30'},
    {value: 50, label: 'Top 50'},
    {value: 100, label: 'Top 100'}
];

const buttonVolumeSort = [
    {value: 100, label: 'Min 100'},
    {value: 1000, label: 'Min 1000'},
    {value: 5000, label: 'Min 5000'},
    {value: 10000, label: 'Min 10 000'},
    {value: 100000, label: 'Min 100 000'}
];

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
}

export default class TableKeywords extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'rank'
        }
    }

    static propTypes = {
        dataKeywords: PropTypes.array.isRequired,
        pagesPagination: PropTypes.number.isRequired,
        currentPage: PropTypes.number.isRequired,
        intervalElement: PropTypes.array.isRequired,

        paginationKeywords: PropTypes.func.isRequired,
        paginationNumber: PropTypes.array.isRequired,
        filterValue: PropTypes.string.isRequired,
        filterLabel: PropTypes.string.isRequired,

        onHandleFilterRank: PropTypes.func.isRequired,
        onHandleFilterVolume: PropTypes.func.isRequired,
        onHandleFilterUrl: PropTypes.func.isRequired,
        ajaxCsvKeywords: PropTypes.func.isRequired,

        loaded: PropTypes.bool.isRequired,
    };

    handleRequestSort(e, key, idSvg) {
        e.preventDefault();

        let target = e.target;
        let className = target.className;

        if (className === 'sortSpan') {
            this.handleRequestOrder(e, key);

            let svgSort = document.querySelector('#' + idSvg);
            if (this.state.order === 'desc') {
                svgSort.classList.add('sort-no-transform')
            } else {
                svgSort.classList.remove('sort-no-transform')
            }
        }
    }

    handleRequestOrder(e, orderBy) {
        e.preventDefault();

        let order = 'desc';
        if (this.state.order === 'desc') {
            order = 'asc'
        }

        this.setState({order: order, orderBy: orderBy})
    }


    render() {
        const {
            dataKeywords, pagesPagination, currentPage, intervalElement, paginationKeywords, onHandleFilterRank, onHandleFilterVolume, onHandleFilterUrl,
            paginationNumber, filterValue, filterLabel, loaded, ajaxCsvKeywords
        } = this.props;
        const {order, orderBy} = this.state;
        const slug = require('slugifyjs').fromLocale('en');

        const sortSvg = (idSvg) => {
            return (
                <svg
                    className="svg-icon-position sort-label-icon rotate-icon opacity"
                    focusable="false" viewBox="0 0 24 24" id={idSvg} width={24} height={24}>
                    <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path>
                </svg>
            )
        };

        return (
            <tr id='tr-keywords' className='d-none' data-active="no-active">
                {!loaded &&
                <div className="panel__refresh">
                    <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                    </svg>
                </div>
                }
                <td colSpan={7}>
                    <div
                        className={pagesPagination !== 0 ? "table-responsive table-keywords" : "table-responsible-no-overflow table-keywords"}>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th className='thSortTable'>
                                    <div className='block-sort'>#</div>
                                </th>
                                <th className='thSortTable'>
                                    <div className='block-sort'>Keyword</div>
                                </th>
                                <th>
                                    <div className='block-sort'>
                                        <span onClick={e => this.handleRequestSort(e, 'rank', 'rank-sort')}
                                              className='sortSpan'>
                                        Position
                                            {sortSvg('rank-sort')}
                                    </span>
                                        <UncontrolledDropdown>
                                            <DropdownToggle className="icon icon--right" outline>
                                                <p>
                                                    {
                                                        filterLabel === 'Position' ?
                                                            filterValue !== '' ? 'Top ' + filterValue
                                                                : 'Rank'
                                                            : 'Rank'
                                                    }
                                                    <ChevronDownIcon/>
                                                </p>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown__menu">
                                                {
                                                    buttonRankSort.map(d => {
                                                        return (
                                                            <DropdownItem
                                                                onClick={e => onHandleFilterRank(e, d.value)}
                                                                active={filterLabel === 'Position' && parseInt(filterValue) === d.value}>{d.label}</DropdownItem>
                                                        )
                                                    })
                                                }
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </th>
                                <th>
                                    <div className='block-sort'>
                                        <span
                                            onClick={e => this.handleRequestSort(e, 'search_volume', 'search-volume-sort')}
                                            className='sortSpan'>
                                        Search Volume
                                            {sortSvg('search-volume-sort')}
                                    </span>
                                        <UncontrolledDropdown>
                                            <DropdownToggle className="icon icon--right" outline>
                                                <p>
                                                    {
                                                        filterLabel === 'Volume de recherche.' ?
                                                            filterValue !== '' ? 'Min ' + filterValue
                                                                : 'Volume'
                                                            : 'Volume'
                                                    }
                                                    <ChevronDownIcon/>
                                                </p>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown__menu">
                                                {
                                                    buttonVolumeSort.map(d => {
                                                        return (
                                                            <DropdownItem
                                                                onClick={e => onHandleFilterVolume(e, d.value)}
                                                                active={filterLabel === 'Volume de recherche.' && parseInt(filterValue) === d.value}>{d.label}</DropdownItem>
                                                        )
                                                    })
                                                }
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </th>
                                <th style={{paddingLeft: '5rem'}} className='thSortTable'>
                                    <div className='block-sort'>Traffic Share</div>
                                </th>
                                <th style={{paddingLeft: '5rem'}} className={filterLabel === 'URL' ? '' : 'thSortTable'}>
                                    <div className='block-sort'>
                                        <span className='sortSpan'>URL </span>
                                        {
                                            filterLabel === 'URL' &&
                                                <button className='btn btn-outline-secondary ml-3' onClick={ajaxCsvKeywords}>Reset</button>
                                        }
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            {
                                pagesPagination !== 0 &&
                                <tbody>
                                {
                                    dataKeywords
                                        .sort(getSorting(order, orderBy))
                                        .map((value, index) => {
                                            return (
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {value.keyword}
                                                        <Link to={{
                                                            pathname: '/seo/serp/' + slug.parse(value.keyword),
                                                            state: {value: slug.parse(value.keyword)}
                                                        }}>
                                                            <Icon path={mdiGoogleAnalytics}
                                                                  title="Serp Google"
                                                                  color='#ddd'
                                                                  style={{height: '14px', width: '14px'}}/>
                                                        </Link>
                                                    </td>
                                                    <td>{value.rank}</td>
                                                    <td>
                                                        <p className='mb-2'>{value.search_volume}</p>
                                                    </td>
                                                    <td>
                                                        <div className="progress-wrap progress-wrap--small">
                                                            <Progress
                                                                value={value.search_volume !== '0' ? Math.round((value.traffic / value.search_volume) * 100) : 0}>
                                                                {value.search_volume !== '0' ? Math.round((value.traffic / value.search_volume) * 100) : 0}%
                                                            </Progress>
                                                        </div>
                                                    </td>
                                                    <td style={{paddingLeft: '5rem'}}>
                                                        <a href="#" onClick={e => onHandleFilterUrl(e, value.url)}
                                                           className='active-link-tab'>{value.url}</a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                }
                                </tbody>
                            }
                        </table>
                        {
                            pagesPagination !== 0 && <Pagination currentPage={currentPage}
                                                                 intervalElement={intervalElement}
                                                                 pagesPagination={pagesPagination}
                                                                 paginationKeywords={paginationKeywords}
                                                                 paginationNumber={paginationNumber}/>
                        }
                    </div>
                </td>
            </tr>
        )
    }
}
