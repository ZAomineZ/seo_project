/* eslint-disable */
import React, {PureComponent} from 'react';
import Panel from '../../../../shared/components/Panel';
import ResponsiveTable from '../../../Tables/BasicTables/components/ResponsiveTable';
import PropTypes from "prop-types";

class DefaultPanel extends PureComponent {
    static propTypes = {
        url_domain: PropTypes.string.isRequired,
        domain: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Panel xs={12} md={12} lg={6} title="Crawl Tab">
                <ResponsiveTable url_domain={this.props.url_domain} domain={this.props.domain} />
            </Panel>
        );
    }
}

export default DefaultPanel;
