/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from "prop-types";

export class Pagination extends PureComponent
{
    constructor(props)
    {
        super(props);
    }

    static propTypes = {
      currentPage: PropTypes.number.isRequired,
      intervalElement: PropTypes.array.isRequired,
      pagesPagination: PropTypes.number.isRequired,
      paginationKeywords: PropTypes.func.isRequired,
      paginationNumber: PropTypes.array.isRequired
    };

    render() {
        const {currentPage, intervalElement, pagesPagination, paginationKeywords, paginationNumber} = this.props;

        return (
            <div className="pagination__wrap">
                <nav className="pagination" aria-label="pagination">
                    <ul className="pagination">
                        <li className={
                            currentPage === 1 ?
                                'pagination__item page-item disabled' :
                                'pagination__item page-item'
                        }>
                            <button type="button"
                                    onClick={e => paginationKeywords(e, currentPage - 1, currentPage, true)}
                                    className="pagination__link pagination__link--arrow page-link">
                                <svg className="mdi-icon pagination__link-icon" width="24" height="24"
                                     fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
                                </svg>
                            </button>
                        </li>
                        {
                            paginationNumber.map(d => {
                                return (
                                    <li className={currentPage === d ? "pagination__item page-item active" : "pagination__item page-item "}>
                                        {
                                            d > currentPage ?
                                                <button type="button"
                                                        onClick={e => paginationKeywords(e, d, d - 1, false)}
                                                        className="pagination__link page-link">
                                                    {d}
                                                </button>
                                                :
                                                d === pagesPagination || currentPage === 1 ?
                                                    <button type="button"
                                                            className="pagination__link page-link">
                                                        {d}
                                                    </button>
                                                    :
                                                    <button type="button"
                                                            onClick={e => paginationKeywords(e, d, d + 1, true)}
                                                            className="pagination__link page-link">
                                                        {d}
                                                    </button>
                                        }
                                    </li>
                                )
                            })
                        }
                        <li className={
                            currentPage === pagesPagination ?
                                'pagination__item page-item disabled' :
                                'pagination__item page-item'
                        }>
                            <button type="button"
                                    onClick={e => paginationKeywords(e, currentPage + 1, currentPage, false)}
                                    className="pagination__link pagination__link--arrow page-link">
                                <svg className="mdi-icon pagination__link-icon" width="24" height="24"
                                     fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </nav>
                <div className="pagination-info">
                    <span>Showing {intervalElement[0] === 0 ? intervalElement[0] + 1 : intervalElement[0]} to {intervalElement[1] === 99 ? intervalElement[1] + 1 : intervalElement[1]} results</span>
                </div>
            </div>
        )
    }
}
