/* eslint-disable */
import React, { PureComponent } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';
import range from 'lodash.range';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';

export default class PaginationComponent extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf().isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number,
  };

  static defaultProps = {
    pageSize: 1,
  };

  constructor(props) {
    super(props);
    this.state = { pager: {}, size: this.props.pageSize };
  }

  componentWillMount() {
    // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps) {
    // reset page if items array has changed
    if (this.props.items !== prevProps.items) {
      this.setPage(this.props.initialPage);
    }
  }

  setPage = (page) => {
    const { items } = this.props;
    const { pager, size } = this.state;

    if (page < 1 || page > pager.totalPages) {
      return;
    }

    // get new pager object for specified page
    this.pager = this.getPager(items.length, page, size);

    // get new page of items from items array
    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // update state
    this.setState({ pager: this.pager });

    // call change page function in parent component
    this.props.onChangePage(pageOfItems);
  };

  getPager = (totalItems, curPage, pSize) => {
    // default to first page
    const currentPage = curPage || 1;

    // default page size is 10
    const pageSize = pSize || 1;

    // calculate total Ajax
    const totalPages = Math.ceil(totalItems / pageSize);

    let startPage;
    let endPage;
    if (totalPages <= 10) {
      // less than 10 total Ajax so show all
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage <= 6) {
      // more than 10 total Ajax so calculate start and end Ajax
      startPage = 1;
      endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min((startIndex + pageSize) - 1, totalItems - 1);

    // create an array of Ajax to ng-repeat in the pager control
    const pages = range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    };
  };

  render() {
    const { items } = this.props;
    const { pager } = this;

    return (
      <div className="pagination__wrap">
        {(!pager.pages || pager.pages.length <= 1) ? '' :
        <Pagination className="pagination">
          <PaginationItem className="pagination__item" disabled={pager.currentPage === 1}>
            <PaginationLink
              className="pagination__link pagination__link--arrow"
              type="button"
              onClick={() => this.setPage(1)}
            >
              <ChevronLeftIcon className="pagination__link-icon" />
            </PaginationLink>
          </PaginationItem>
          {pager.pages.map(page =>
              (
                <PaginationItem
                  className="pagination__item"
                  key={page}
                  active={pager.currentPage === page}
                >
                  <PaginationLink className="pagination__link" type="button" onClick={() => this.setPage(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>))}
          <PaginationItem className="pagination__item" disabled={pager.currentPage === pager.totalPages}>
            <PaginationLink
              className="pagination__link pagination__link--arrow"
              type="button"
              onClick={() => this.setPage(pager.totalPages)}
            >
              <ChevronRightIcon className="pagination__link-icon" />
            </PaginationLink>
          </PaginationItem>
        </Pagination>
        }
        <div className="pagination-info">
          <span>Showing {`${(pager.pageSize * (pager.currentPage - 1)) + 1} `}
            to {pager.pageSize * pager.currentPage > items.length ? items.length
              : pager.pageSize * pager.currentPage} of {items.length}
          </span>
        </div>
      </div>
    );
  }
}

/* eslint-enable */

// todo: rework it
