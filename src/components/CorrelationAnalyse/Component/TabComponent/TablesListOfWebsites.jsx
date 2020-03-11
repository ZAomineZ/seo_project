/* eslint-disable */

import React, {PureComponent} from "react";
import Panel from "../../../../shared/components/Panel";
import PropTypes from 'prop-types';

import MatTableHead from "./MaterialTable/MatTableHead";
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import MatTableToolbar from "./MaterialTable/MatTableToolbar";

export class TablesListOfWebsites extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
            data: []
        }
    }

    static propTypes = {
        data: PropTypes.array.isRequired,
        methodNewData: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.data.length !== 0) {
            const data = nextProps.data;
            const dataWebsites = data.map((item, index) => {
                return {
                    id: index + 1,
                    anchor: item.anchor,
                    ratio: item.ratio,
                    referring_ip: item.referring_ip,
                    score_rank: item.score_rank,
                    traffic: item.traffic,
                    trust_rank: item.trust_rank,
                    website: item.website
                }
            });

            this.setState({data: dataWebsites})
        }
    }

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
        const {data} = this.state;
        let copyData = [...data];
        const {selected} = this.state;

        for (let i = 0; i < selected.length; i += 1) {
            copyData = copyData.filter(obj => obj.id !== selected[i]);
        }

        this.props.methodNewData(copyData);

        this.setState({data: copyData, selected: []});
    };

    isSelected = (id) => {
        const {selected} = this.state;
        return selected.indexOf(id) !== -1;
    };

    render() {
        const {selected, data} = this.state;

        return (
            <Panel
                xl={12}
                lg={12}
                md={12}
                title={'Lists of websites'}
                subhead="Top sales of the last week"
                serpFeature={[]}
            >
                <MatTableToolbar
                    numSelected={selected.length}
                    handleDeleteSelected={this.handleDeleteSelected}/>
                <div className="material-table__wrap">
                    <Table className="material-table">
                        <MatTableHead
                            numSelected={selected.length}
                            onSelectAllClick={this.handleSelectAllClick}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {data.map((item) => {
                                const isSelected = this.isSelected(item.id);
                                return (
                                    <TableRow
                                        className="material-table__row"
                                        role="checkbox"
                                        onClick={event => this.handleClick(event, item.id)}
                                        aria-checked={isSelected}
                                        tabIndex={-1}
                                        key={item.id}
                                        selected={isSelected}
                                    >
                                        <TableCell className="material-table__cell" padding="checkbox">
                                            <Checkbox checked={isSelected} className="material-table__checkbox"/>
                                        </TableCell>
                                        <TableCell
                                            className="material-table__cell material-table__cell-right"
                                            component="th"
                                            scope="row"
                                            padding="none"
                                        >
                                            <div className='tr-rank'>
                                                {item.id}
                                            </div>
                                            <img className="img-icon mr-1"
                                                 src={"https://s2.googleusercontent.com/s2/favicons?domain=" + item.website}
                                                 alt=""/>
                                            {item.website}
                                        </TableCell>
                                        <TableCell
                                            className="material-table__cell material-table__cell-right">
                                            {item.referring_ip}
                                        </TableCell>
                                        <TableCell
                                            className="material-table__cell material-table__cell-right"
                                        >
                                            {item.score_rank}
                                        </TableCell>
                                        <TableCell
                                            className="material-table__cell material-table__cell-right"
                                        >
                                            {item.trust_rank}
                                        </TableCell>
                                        <TableCell
                                            className="material-table__cell material-table__cell-right"
                                        >
                                            {Math.round(item.ratio)}
                                        </TableCell>
                                        <TableCell
                                            className="material-table__cell material-table__cell-right"
                                        >
                                            {item.traffic}
                                        </TableCell>
                                        <TableCell
                                            className="material-table__cell material-table__cell-right"
                                        >
                                            {item.anchor}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </Panel>
        )
    }
}
