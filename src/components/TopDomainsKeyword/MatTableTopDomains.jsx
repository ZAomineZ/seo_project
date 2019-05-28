/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody } from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import MatTableHead from './MatTableHeadTopDomains';
import MatTableToolbarTopDomain from './MatTableToolbarTopDomain';
import axios from "axios";

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

export default class MatTable extends PureComponent {
    static propTypes = {
      data: PropTypes.array.isRequired,
      keyword: PropTypes.string.isRequired
    };

    state = {
      order: 'asc',
      orderBy: 'domains',
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 5,
      filter: "",
    };

    handleChange(event) {
        this.setState({filter : event.target.value})
    }

    searchingFor (filter) {
        return function (item) {
            return item.domain.toLowerCase().includes(filter.toLowerCase()) || !filter
        }
    }

    handleRequestSort = (event, property) => {
      const orderBy = property;
      let order = 'desc';

      if (this.state.orderBy === property && this.state.order === 'desc') { order = 'asc'; }

      this.setState({ order, orderBy });
    };

    Download (event, data) {
        event.preventDefault();
        axios.get("http://" + window.location.hostname + "/ReactProject/App/Ajax/TopKeywordCsv.php", {
            headers: {
                'Content-Type': 'application/csv',
            },
            params: {
                'data': data
            }
        }).then(response => {
            if (response && response.status === 200) {
                window.location = response.request.responseURL
            }
        })
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
      const {
        data, order, orderBy, selected, filter
      } = this.state;
      let i = 0;
      const data_obj = Object.values(this.props.data);
      const data_arr_last = data_obj.map((d) => {
          let data_obj_d = Object.values(d);
          if (data_obj.length > 1) {
              if (data_obj_d.length !== 0) {
                  return {
                      id: i++,
                      date: data_obj_d[0][data_obj_d[0].length - 2].date,
                      domain: data_obj_d[0][data_obj_d[0].length - 2].domain,
                      top_3: data_obj_d[0][data_obj_d[0].length - 2].top_3,
                      top_4_10: data_obj_d[0][data_obj_d[0].length - 2].top_4_10,
                      top_11_20: data_obj_d[0][data_obj_d[0].length - 2].top_11_20,
                      top_21_50: data_obj_d[0][data_obj_d[0].length - 2].top_21_50,
                      top_51_100: data_obj_d[0][data_obj_d[0].length - 2].top_51_100,
                      traffic: data_obj_d[0][data_obj_d[0].length - 2].traffic,
                  }
              } else {
                  return {
                      id: i++,
                      date: 'undefined',
                      domain: 'undefined',
                      top_3: 'undefined',
                      top_4_10: 'undefined',
                      top_11_20: 'undefined',
                      top_21_50: 'undefined',
                      top_51_100: 'undefined',
                      traffic: 'undefined',
                  }
              }
          }
          if (data_obj_d.length !== 0) {
              return {
                  id: i++,
                  date: d[data_obj_d.length - 2].date,
                  domain: d[data_obj_d.length - 2].domain,
                  top_3: d[data_obj_d.length - 2].top_3,
                  top_4_10: d[data_obj_d.length - 2].top_4_10,
                  top_11_20: d[data_obj_d.length - 2].top_11_20,
                  top_21_50: d[data_obj_d.length - 2].top_21_50,
                  top_51_100: d[data_obj_d.length - 2].top_51_100,
                  traffic: d[data_obj_d.length - 2].traffic,
              }
          } else {
              return {
                  id: i++,
                  date: 'undefined',
                  domain: 'undefined',
                  top_3: 0,
                  top_4_10: 0,
                  top_11_20: 0,
                  top_21_50: 0,
                  top_51_100: 0,
                  traffic: 0,
              }
          }
      });
      const data_arr_now = data_obj.map((d) => {
          let data_obj_d = Object.values(d);
          if (data_obj.length > 1) {
              if (data_obj_d.length !== 0) {
                  return {
                      id: i++,
                      date: data_obj_d[0][data_obj_d[0].length - 1].date,
                      domain: data_obj_d[0][data_obj_d[0].length - 1].domain,
                      top_3: data_obj_d[0][data_obj_d[0].length - 1].top_3,
                      top_4_10: data_obj_d[0][data_obj_d[0].length - 1].top_4_10,
                      top_11_20: data_obj_d[0][data_obj_d[0].length - 1].top_11_20,
                      top_21_50: data_obj_d[0][data_obj_d[0].length - 1].top_21_50,
                      top_51_100: data_obj_d[0][data_obj_d[0].length - 1].top_51_100,
                      traffic: data_obj_d[0][data_obj_d[0].length - 1].traffic,
                      diff_traffic: data_obj_d[0][data_obj_d[0].length - 1].traffic - data_obj_d[0][data_obj_d[0].length - 2].traffic,
                      diff_top_3: data_obj_d[0][data_obj_d[0].length - 1].top_3 - data_obj_d[0][data_obj_d[0].length - 2].top_3,
                      diff_top_4_10: data_obj_d[0][data_obj_d[0].length - 1].top_4_10 - data_obj_d[0][data_obj_d[0].length - 2].top_4_10,
                      diff_top_11_20: data_obj_d[0][data_obj_d[0].length - 1].top_11_20 - data_obj_d[0][data_obj_d[0].length - 2].top_11_20,
                      diff_top_21_50: data_obj_d[0][data_obj_d[0].length - 1].top_21_50 - data_obj_d[0][data_obj_d[0].length - 2].top_21_50,
                      diff_top_51_100: data_obj_d[0][data_obj_d[0].length - 1].top_51_100 - data_obj_d[0][data_obj_d[0].length - 2].top_51_100
                  }
              } else {
                  return {
                      id: i++,
                      date: 'undefined',
                      domain: 'undefined',
                      top_3: 0,
                      top_4_10: 0,
                      top_11_20: 0,
                      top_21_50: 0,
                      top_51_100: 0,
                      traffic: 0,
                      diff_traffic: 0,
                      diff_top_3: 0,
                      diff_top_4_10: 0,
                      diff_top_11_20: 0,
                      diff_top_21_50: 0,
                      diff_top_51_100: 0
                  }
              }
          }
          if (data_obj_d.length !== 0) {
              return {
                  id: i++,
                  date: d[data_obj_d.length - 1].date,
                  domain: d[data_obj_d.length - 1].domain,
                  top_3: d[data_obj_d.length - 1].top_3,
                  top_4_10: d[data_obj_d.length - 1].top_4_10,
                  top_11_20: d[data_obj_d.length - 1].top_11_20,
                  top_21_50: d[data_obj_d.length - 1].top_21_50,
                  top_51_100: d[data_obj_d.length - 1].top_51_100,
                  traffic: d[data_obj_d.length - 1].traffic,
                  diff_traffic: d[data_obj_d.length - 1].traffic - d[data_obj_d.length - 2].traffic,
                  diff_top_3: d[data_obj_d.length - 1].top_3 - d[data_obj_d.length - 2].top_3,
                  diff_top_4_10: d[data_obj_d.length - 1].top_4_10 - d[data_obj_d.length - 2].top_4_10,
                  diff_top_11_20: d[data_obj_d.length - 1].top_11_20 - d[data_obj_d.length - 2].top_11_20,
                  diff_top_21_50: d[data_obj_d.length - 1].top_21_50 - d[data_obj_d.length - 2].top_21_50,
                  diff_top_51_100: d[data_obj_d.length - 1].top_51_100 - d[data_obj_d.length - 2].top_51_100
              }
          } else {
              return {
                  id: i++,
                  date: 'undefined',
                  domain: 'undefined',
                  top_3: 0,
                  top_4_10: 0,
                  top_11_20: 0,
                  top_21_50: 0,
                  top_51_100: 0,
                  traffic: 0,
                  diff_traffic: 0,
                  diff_top_3: 0,
                  diff_top_4_10: 0,
                  diff_top_11_20: 0,
                  diff_top_21_50: 0,
                  diff_top_51_100: 0
              }
          }
      });

        const svg_red = <svg
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
      const svg_green = <svg
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

    return (
        <Card>
          <CardBody className="card_body_pt-20">
            <div className="card__title">
              <h5 className="bold-text">Top Domains</h5>
              <div className="pt-5">
                <button onClick={e => this.Download(e, data_arr_now)} className="btn btn-primary">Download CSV</button>
                <button onClick={e => this.Download(e, data_arr_last)} className="btn btn-primary">Download CSV last month</button>
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
                  rowCount={data_arr_now.length}
                />
                <TableBody>
                  {data_arr_now.filter(this.searchingFor(filter))
                                    .sort(getSorting(order, orderBy))
                                    .map((d) => {
                                        const isSelected = this.isSelected(d.id);
                                        return (
                                          <TableRow
                                            className="material-table__row"
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={d.id}
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
                                                      Math.sign(d.diff_traffic) === -1 ?
                                                          svg_red  : svg_green
                                                  }
                                                  <p>{ Math.sign(d.diff_traffic) === -1 ?
                                                      d.diff_traffic
                                                      : '+' + (d.diff_traffic)}</p>
                                              </div>
                                            </TableCell>
                                            <TableCell className="material-table__cell">
                                              <div
                                                className="dashboard__total"
                                              >
                                                <p className="">{d.top_3}</p>
                                                  {
                                                      Math.sign(d.diff_top_3) === -1 ?
                                                          svg_red  : svg_green
                                                  }
                                                  <p>{ Math.sign(d.diff_top_3) === -1 ?
                                                      d.diff_top_3
                                                      : '+' + (d.diff_top_3)}</p>
                                              </div>
                                            </TableCell>
                                            <TableCell className="material-table__cell">
                                              <div
                                                className="dashboard__total"
                                              >
                                                <p className="">{d.top_4_10}</p>
                                                  {
                                                      Math.sign(d.diff_top_4_10) === -1 ?
                                                          svg_red  : svg_green
                                                  }
                                                  <p>{ Math.sign(d.diff_top_4_10) === -1 ?
                                                      d.diff_top_4_10
                                                      : '+' + (d.diff_top_4_10)}</p>
                                              </div>
                                            </TableCell>
                                            <TableCell className="material-table__cell">
                                              <div
                                                className="dashboard__total"
                                              >
                                                <p className="">{d.top_11_20}</p>
                                                  {
                                                      Math.sign(d.diff_top_11_20) === -1 ?
                                                          svg_red  : svg_green
                                                  }
                                                  <p>{ Math.sign(d.diff_top_11_20) === -1 ?
                                                      d.diff_top_11_20
                                                      : '+' + (d.diff_top_11_20)}</p>
                                              </div>
                                            </TableCell>
                                            <TableCell className="material-table__cell">
                                              <div
                                                className="dashboard__total"
                                              >
                                                <p className="">{d.top_21_50}</p>
                                                  {
                                                      Math.sign(d.diff_top_21_50) === -1 ?
                                                          svg_red  : svg_green
                                                  }
                                                  <p>{ Math.sign(d.diff_top_21_50) === -1 ?
                                                      d.diff_top_21_50
                                                      : '+' + (d.diff_top_21_50)}</p>
                                              </div>
                                            </TableCell>
                                              <TableCell className="material-table__cell">
                                              <div
                                                className="dashboard__total"
                                              >
                                                <p className="">{d.top_51_100}</p>
                                                  {
                                                      Math.sign(d.diff_top_51_100) === -1 ?
                                                          svg_red  : svg_green
                                                  }
                                                  <p>{ Math.sign(d.diff_top_51_100) === -1 ?
                                                      d.diff_top_51_100
                                                      : '+' + (d.diff_top_51_100)}</p>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        );
                                    })}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      );
    }
}
