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
        data_asc: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired,
        data_desc: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired,
        data_url: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired,
        data_assortUrl: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]).isRequired
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
        const data_array_url = Object.values(this.props.data_url);
        const data_array_assortUrl = Object.values(this.props.data_assortUrl);

        const data_asc = data_array_asc.map(d => {
           return {url: d.url !== null ? d.url : '', anchorUrl: d.anchorUrl !== null ? d.anchorUrl : '', anchorText: d.anchorText !== null ? d.anchorText : '', noFollow : d.noFollow !== null ? d.noFollow : ''}
        });

        const data_desc = data_array_desc.map(d => {
            return {url: d.url !== null ? d.url : '', anchorUrl: d.anchorUrl !== null ? d.anchorUrl : '', anchorText: d.anchorText !== null ? d.anchorText : '', noFollow : d.noFollow !== null ? d.noFollow : ''}
        });

        const data_url = data_array_url.map(d => {
            return {url: d.url !== null ? d.url : '', anchorUrl: d.anchorUrl !== null ? d.anchorUrl : '', anchorText: d.anchorText !== null ? d.anchorText : '', noFollow : d.noFollow !== null ? d.noFollow : ''}
        });

        const data_assortUrl = data_array_assortUrl.map(d => {
            return {url: d.url !== null ? d.url : '', anchorUrl: d.anchorUrl !== null ? d.anchorUrl : '', anchorText: d.anchorText !== null ? d.anchorText : '', noFollow : d.noFollow !== null ? d.noFollow : ''}
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
                        data_url={data_url}
                        data_assortUrl={data_assortUrl}
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
                        <th>Anchors</th>
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
