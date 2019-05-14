/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DefaultPanel from '../../containers/UI/Panels/components/DefaultPanel';

class CrawlTab extends PureComponent{
    static propTypes = {
        url_domain: PropTypes.string.isRequired,
        domain: PropTypes.string.isRequired,
    };

    render() {
        return (
            <DefaultPanel url_domain={this.props.url_domain} domain={this.props.domain} />
        )
    }
}

export default CrawlTab;
