import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rows = [
  {
    id: 'rank', numeric: false, disablePadding: true, label: 'Rank',
  },
  {
    id: 'name', numeric: false, disablePadding: false, label: 'Name',
  },
  {
    id: 'url', numeric: false, disablePadding: true, label: 'Url',
  },
  {
    id: 'place', numeric: false, disablePadding: true, label: 'Place',
  },
  {
    id: 'volume', numeric: false, disablePadding: true, label: 'Volume',
  },
  {
    id: 'charts', numeric: false, disablePadding: false, label: 'Charts',
  },
];

export default class MatTableHead extends PureComponent {
  static propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  createSortHandler = property => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick, order, orderBy, numSelected, rowCount,
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
