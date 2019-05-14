import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rows = [
  {
    id: 'domain', numeric: false, disablePadding: true, label: 'Domain',
  },
  {
    id: 'traffic', numeric: false, disablePadding: false, label: 'Traffic',
  },
  {
    id: 'top_3', numeric: false, disablePadding: true, label: 'Top 3',
  },
  {
    id: 'top_4_10', numeric: false, disablePadding: true, label: 'Top 4-10',
  },
  {
    id: 'top_11_20', numeric: false, disablePadding: false, label: 'Top 11-20',
  },
  {
    id: 'top_21_50', numeric: false, disablePadding: false, label: 'Top 21-50',
  },
  {
    id: 'top_51_100', numeric: false, disablePadding: false, label: 'Top 51-100',
  },
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
