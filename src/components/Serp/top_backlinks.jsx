/* eslint-disable */
import React, {PureComponent} from 'react';
import {ButtonToolbar, CardBody, Table} from 'reactstrap';
import PropTypes from 'prop-types';
import Panel from '../../shared/components/Panel';
import ModalTop from './modal_top_bl';

export default class TopBacklinks extends PureComponent {
    static propTypes = {
        modal: PropTypes.number,
        data: PropTypes.array.isRequired,
        data_asc: PropTypes.array.isRequired,
        data_desc: PropTypes.array.isRequired,
    };

    static defaultProps = {
        modal: 0,
        data: [],
        data_bl: []
    };

    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.data.map(d => {
            return  { url: d.source_url, anchor: d.anchor, nofollow: d.nofollow}
        });

        const data_array_asc = Object.values(this.props.data_asc);
        const data_array_desc = Object.values(this.props.data_desc);

        const data_asc = data_array_asc.map(d => {
           return {url: d.url !== null ? d.url : '', anchorUrl: d.anchorUrl !== null ? d.anchorUrl : '', noFollow : d.noFollow !== null ? d.noFollow : ''}
        });

        const data_desc = data_array_desc.map(d => {
           return {url: d.url !== null ? d.url : '', anchorUrl: d.anchorUrl !== null ? d.anchorUrl : '', noFollow : d.noFollow !== null ? d.noFollow : ''}
        });

        const modal =
            this.props.modal === 1 ? <CardBody>
                <ButtonToolbar>
                    <ModalTop
                        color="primary"
                        title="Backlinks"
                        btn="More"
                        data_asc={data_asc}
                        data_desc={data_desc}
                    />
                </ButtonToolbar>
            </CardBody> : null;

        return (
            <Panel
                xl={4}
                lg={5}
                md={12}
                xs={12}
                title="Top Backlinks"
                subhead="Ratings by Market Capitalization"
            >
                <Table responsive striped>
                    <thead>
                    <tr>
                        <th>URL</th>
                        <th>Anchor</th>
                        <th>Type : Follow/NoFollow</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((item) => (
                            <tr>
                                <td>{ item.url }</td>
                                <td>{ item.anchor }</td>
                                <td>
                                    {
                                    item.nofollow === false ?
                                        <span className="badge badge-success">Follow</span> :
                                        <span className="badge badge-danger">NoFollow</span>
                                    }
                                </td>
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
