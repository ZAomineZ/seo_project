/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rows = [
    {
        id: 'keyword', numeric: false, disablePadding: false, label: 'Keyword',
    },
    {
        id: 'url', numeric: false, disablePadding: false, label: 'Url',
    },
    {
        id: 'rank', numeric: false, disablePadding: true, label: 'Position',
    },
    {
        id: 'diff', numeric: false, disablePadding: true, label: 'Diff',
    },
    {
        id: 'volume', numeric: false, disablePadding: true, label: 'Volume',
    },
    {
        id: 'charts', numeric: false, disablePadding: false, label: 'Charts',
    },
];

export default class RankTableHead extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
    };

    createSortHandler = property => (event) => {
        this.props.onRequestSort(event, property);
    };

    render() {
        return (
            <TableHead>
                <TableRow>
                    {rows.map(row => (
                        <TableCell
                            key={row.id}
                            numeric={row.numeric}
                            sortDirection={this.props.orderBy === row.id ? this.props.order : false}
                            padding={row.disablePadding ? 'none' : 'default'}
                        >
                            <TableSortLabel active={this.props.orderBy === row.id}
                                            direction={this.props.order}
                                            onClick={this.createSortHandler(row.id)}>
                                {row.label}
                            </TableSortLabel>
                        </TableCell>
                    ), this)}
                </TableRow>
            </TableHead>
        );
    }
}
