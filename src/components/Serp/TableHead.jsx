/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rows = [
    {
        id: 'anchors', numeric: false, disablePadding: true, label: 'Anchors',
    },
    {
        id: 'backlinks_num', numeric: false, disablePadding: false, label: 'Backlinks Number',
    },
    {
        id: 'domains_num', numeric: false, disablePadding: true, label: 'Domains Number',
    }
];

export default class MatTableHead extends PureComponent {
    static propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
    };

    createSortHandler = property => (event) => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {
            order, orderBy,
        } = this.props;

        return (
            <TableHead>
                <TableRow>
                    {rows.map(row => (
                        <TableCell
                            key={row.id}
                            numeric={row.numeric}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === row.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === row.id}
                                direction={order}
                                onClick={this.createSortHandler(row.id)}
                            >
                                {row.label}
                            </TableSortLabel>
                        </TableCell>
                    ), this)}
                </TableRow>
            </TableHead>
        );
    }
}
