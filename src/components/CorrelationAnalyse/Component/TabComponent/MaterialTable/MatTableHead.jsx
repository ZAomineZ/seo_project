/* eslint-disable */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rows = [
    {
        id: 'rank', disablePadding: true, label: 'Rank',
    },
    {
        id: 'referring_ip', disablePadding: false, label: 'Referring Ip',
    },
    {
        id: 'score_rank', disablePadding: false, label: 'Score Rank',
    },
    {
        id: 'trust_rank', disablePadding: false, label: 'Trust Rank',
    },
    {
        id: 'ratio', disablePadding: false, label: 'Ratio',
    },
    {
        id: 'traffic', disablePadding: false, label: 'Traffic',
    },
    {
        id: 'anchor', disablePadding: false, label: 'Anchor',
    },
];

class MatTableHead extends PureComponent {
    static propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    createSortHandler = property => (event) => {
        const { onRequestSort } = this.props;
        onRequestSort(event, property);
    };

    render() {
        const {
            onSelectAllClick, order, orderBy, numSelected, rowCount, rtl,
        } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            className={`material-table__checkbox ${numSelected === rowCount && 'material-table__checkbox--checked'}`}
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {rows.map(row => (
                        <TableCell
                            className="material-table__cell material-table__cell--sort material-table__cell-right"
                            key={row.id}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === row.id ? order : false}
                        >
                            {row.label}
                        </TableCell>
                    ), this)}
                </TableRow>
            </TableHead>
        );
    }
}

export default connect(state => ({
    rtl: state.rtl,
}))(MatTableHead);
