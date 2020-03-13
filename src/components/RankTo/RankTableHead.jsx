/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rowsData = [
    {
        id: 'keyword', numeric: false, disablePadding: false, label: 'Keyword',
    },
    {
        id: 'url', numeric: false, disablePadding: false, label: 'Url',
    },
    {
        id: 'features', numeric: false, disablePadding: false, label: 'Features',
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
        this.state = {
            rows: []
        }
    }

    static propTypes = {
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
        noFeature: PropTypes.bool.isRequired
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.noFeature === true) {
            let rows = rowsData.filter(d => d.id !== 'features');
            this.setState({rows: rows})
        } else {
            this.setState({rows: rowsData})
        }
    }

    createSortHandler = property => (event) => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const {rows} = this.state;

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
