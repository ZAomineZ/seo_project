/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TabData from '../../components/Serp/tab_data';
import Panel from '../../shared/components/Panel';
import {translate} from "react-i18next";

class TabsData extends PureComponent {
    static propTypes = {
        stats: PropTypes.array.isRequired
    };

    constructor() {
        super();
    }

    render() {
        return (
            <Panel
                xl={4}
                lg={5}
                md={12}
                xs={12}
                title="Link Data Profile"
                subhead="Ratings by Market Capitalization"
            >
                <TabData stats={this.props.stats}/>
            </Panel>
        );
    }
}

export default translate('common')(TabsData);

