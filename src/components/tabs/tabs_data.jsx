/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TabData from '../../components/Serp/tab_data';
import Panel from '../../shared/components/Panel';
import {translate} from "react-i18next";

class TabsData extends PureComponent {
    static propTypes = {
        stats: PropTypes.array.isRequired,
        categories: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Panel
                xl={4}
                lg={5}
                md={12}
                xs={12}
                serpFeature={[]}
                title="Link Data Profile"
                subhead="Ratings by Market Capitalization"
            >
                <TabData stats={this.props.stats} categories={this.props.categories}/>
            </Panel>
        );
    }
}

export default translate('common')(TabsData);

