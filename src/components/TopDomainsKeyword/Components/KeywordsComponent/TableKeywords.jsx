/* eslint-disable */

import React, {PureComponent} from "react";
import PropTypes from "prop-types";

export default class TableKeywords extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        dataKeywords: PropTypes.array.isRequired,
        pagesPagination: PropTypes.number.isRequired,
        currentPage: PropTypes.number.isRequired,
        intervalElement: PropTypes.array.isRequired,
        paginationKeywords: PropTypes.func.isRequired,
        loaded: PropTypes.bool.isRequired
    };

    render() {
        const {dataKeywords, pagesPagination, currentPage, intervalElement, paginationKeywords, loaded} = this.props;

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
                    <div className="table-responsive table-keywords">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Keyword</th>
                                <th>Position</th>
                                <th>Search Volume</th>
                                <th>URL</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                dataKeywords.map((value, index) => {
                                    return (
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{value.keyword}</td>
                                            <td>{value.rank}</td>
                                            <td>{value.search_volume}</td>
                                            <td>{value.url}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        <div className="pagination__wrap">
                            <nav className="pagination" aria-label="pagination">
                                <ul className="pagination">
                                    <li className={
                                        currentPage === 1 ?
                                            'pagination__item page-item disabled' :
                                            'pagination__item page-item'
                                    }>
                                        <button type="button"
                                                className="pagination__link pagination__link--arrow page-link">
                                            <svg className="mdi-icon pagination__link-icon" width="24" height="24"
                                                 fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                                            </svg>
                                        </button>
                                    </li>
                                    <li className="pagination__item page-item active">
                                        <button type="button" className="pagination__link page-link">1</button>
                                    </li>
                                    <li className="pagination__item page-item">
                                        <button type="button" className="pagination__link page-link">2</button>
                                    </li>
                                    <li className="pagination__item page-item">
                                        <button type="button" className="pagination__link page-link">3</button>
                                    </li>
                                    <li className="pagination__item page-item">
                                        <button type="button"
                                                onClick={e => paginationKeywords(e, currentPage, currentPage + 1)}
                                                className="pagination__link pagination__link--arrow page-link">
                                            <svg className="mdi-icon pagination__link-icon" width="24" height="24"
                                                 fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                                            </svg>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                            <div className="pagination-info"><span>Showing {intervalElement[0] + 1} to {intervalElement[1] + 1} of {pagesPagination}</span></div>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }
}
