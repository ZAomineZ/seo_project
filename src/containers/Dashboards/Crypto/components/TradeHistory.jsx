/* eslint-disable */
import React, {PureComponent} from 'react';
import {ButtonToolbar, CardBody, Table} from 'reactstrap';
import PropTypes from 'prop-types';
import Panel from '../../../../shared/components/Panel';
import ModalAnchors from '../../../../../src/components/Serp/modal_anchors'

export default class TradeHistory extends PureComponent {
    static propTypes = {
        modal: PropTypes.number,
        anchors: PropTypes.array.isRequired,
    };

    static defaultProps = {
        modal: 0,
        anchors: []
    };

    constructor(props) {
        super(props);
    }

    render() {
        let numbro = require('numbro');

        const data = this.props.anchors.map(d => {
            return  { anchor: d.anchor, backlinks_num: parseInt(d.backlinks_num), domains_num: parseInt(d.domains_num)}
        });

        const modal =
            this.props.modal === 1 ? <CardBody>
            <ButtonToolbar>
                <ModalAnchors
                    color="primary"
                    title="Anchors"
                    btn="More"
                    data={data}
                />
            </ButtonToolbar>
        </CardBody> : null;

        return (
            <Panel
                xl={4}
                lg={5}
                md={12}
                xs={12}
                title="Link Data Profile"
                subhead="Ratings by Market Capitalization"
            >
                <Table responsive striped>
                    <thead>
                    <tr>
                        <th>Anchor</th>
                        <th>Backlinks</th>
                        <th>Domains</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.slice(0, 10).map((item) => (
                            <tr>
                                <td>{ item.anchor }</td>
                                <td>{ numbro(item.backlinks_num).format({average: true, mantissa: 2}) }</td>
                                <td>{ item.domains_num }</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </Table>
                {modal}
            </Panel>
        );
    }
}
