/* eslint-disable */
import React, {PureComponent} from 'react';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Panel from '../../shared/components/Panel';
import MatTableHead from './head_serp';
import MatTableToolbar from '../../containers/Tables/MaterialTable/components/MatTableToolbar';


export default class TopTenComparaison extends PureComponent {
    static propTypes = {
        onDeleteCryptoTableData: PropTypes.func.isRequired,
        buttonExist: PropTypes.string,
        title: PropTypes.string,
        TopOrLose: PropTypes.bool,
        array_rank: PropTypes.object.isRequired,
        keyword: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    };

    static defaultProps = {
        buttonExist: '',
        title: '',
        TopOrLose: false,
        keyword: '',
        value: ''
    };

    state = {
        order: 'asc',
        orderBy: 'url',
        data: [],
        data_diff: [],
        selected: [],
        page: 0,
        rowsPerPage: 10,
        loading: true,
        loaded: false
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.array_rank) {
            this.setState({ data: nextProps.array_rank })
        }
    }

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({order, orderBy});
    };

    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState(state => ({selected: state.data.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    };

    handleClick = (event, id) => {
        const {selected} = this.state;
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

        this.setState({selected: newSelected});
    };

    handleDeleteSelected = () => {
        let copyData = [...this.state.data];
        const {selected} = this.state;

        for (let i = 0; i < selected.length; i += 1) {
            copyData = copyData.filter(obj => obj.id !== selected[i]);
        }

        this.setState({data: copyData, selected: []});
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const {
            data, order, orderBy, selected, rowsPerPage, page,
        } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - (page * rowsPerPage));

        const svg_red = <svg className="mdi-icon dashboard_top_serp_icon"
                             width="24"
                             height="24"
                             fill="currentColor"
                             viewBox="0 0 24 24">
            <path
                d="M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,
                            7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z"/>
        </svg>;
        const svg_green = <svg className="mdi-icon dashboard__trend-icon"
                               width="24"
                               height="24"
                               fill="currentColor"
                               viewBox="0 0 24 24">
            <path
                d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,
                                18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
        </svg>;

        return (
            <Panel
                title={this.props.title ? this.props.title : ''}
                button={this.props.buttonExist ? this.props.buttonExist : ''}
                keyword={this.props.keyword}
                value={this.props.value}
            >
                <MatTableToolbar
                    numSelected={selected.length}
                    handleDeleteSelected={this.handleDeleteSelected}
                    onRequestSort={this.handleRequestSort}
                />
                <Table className="table table-hover">
                    <MatTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        rowCount={data.length}
                    />
                    <TableBody>
                        {data.map((d, index) => {
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
                                        <TableCell className="material-table__cell" padding="checkbox">
                                            <Checkbox checked={isSelected} className="material-table__checkbox"/>
                                        </TableCell>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div>
                                                <div className="block_flex">
                                                    <img
                                                        className="img-icon"
                                                        src={"https://s2.googleusercontent.com/s2/favicons?domain=" + d.title}
                                                        alt=""
                                                    />
                                                    <p className="mr_td">{d.title.substr(0, 70) + '...'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="place_flex">
                                                {
                                                    this.props.TopOrLose ?
                                                            Math.sign(d.rank) === - 1 ? svg_red : svg_green
                                                        :
                                                        <svg
                                                            className="mdi-icon dashboard_top_serp_icon"
                                                            width="24"
                                                            height="24"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                d="M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,
                                            7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z"
                                                            />
                                                        </svg>
                                                }
                                                <p className='dashboard__total-stat'>
                                                    { d.rank }
                                                </p>
                                            </div>
                                        </td>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{height: 49 * emptyRows}}>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Panel>
        );
    }
}
