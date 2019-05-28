/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody } from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import MatTableHead from './TableHead';
import MatTableToolbarTopDomain from './TableToolbar';
import PropTypes from "prop-types";

function createData(anchors, backlinks_num, domains_num) {
    return {
        id: anchors, backlinks_num, domains_num
    };
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => b[orderBy] - a[orderBy] : (a, b) => a[orderBy] - b[orderBy];
}

export default class TabAnchors extends PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            order: 'asc',
            orderBy: 'calories',
            selected: [],
            data: [],
            page: 0,
            rowsPerPage: 5,
            filter: "",
        }
    }

    handleChange(event) {
        this.setState({filter : event.target.value})
    }

    searchingFor (filter) {
        return function (item) {
            return item.anchors.toLowerCase().includes(filter.toLowerCase()) || !filter
        }
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') { order = 'asc'; }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState(state => ({ selected: state.data.map(n => n.id) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        const { selected } = this.state;
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

        this.setState({ selected: newSelected });
    };

    handleDeleteSelected = () => {
        let copyData = [...this.state.data];
        const { selected } = this.state;

        for (let i = 0; i < selected.length; i += 1) {
            copyData = copyData.filter(obj => obj.id !== selected[i]);
        }

        this.setState({ data: copyData, selected: [] });
    };

    componentDidMount() {
        this.setState({
            data: this.props.data.map(d => {
                return { anchors: d.anchor, backlinks_num: d.backlinks_num, domains_num: d.domains_num }
            })
        })
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        let numbro = require('numbro');

        const {
            data, order, orderBy, selected, filter
        } = this.state;

        return (
            <Card>
                <CardBody className="card_body_pt-20">
                    <div className="card__title"></div>
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
                                rowCount={data.length}
                            />
                            <TableBody>
                                {data.filter(this.searchingFor(filter))
                                    .sort(getSorting(order, orderBy))
                                    .map((d) => {
                                        const isSelected = this.isSelected(d.id);
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
                                                <TableCell className="material-table__cell font-default-size">
                                                    {d.anchors}
                                                </TableCell>
                                                <TableCell className="material-table__cell">
                                                    <div
                                                        className="dashboard__total"
                                                    >
                                                        <p className="">{numbro(d.backlinks_num).format({average: true, mantissa: 2})}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="material-table__cell">
                                                    <div
                                                        className="dashboard__total"
                                                    >
                                                        <p className="">{d.domains_num}</p>
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
