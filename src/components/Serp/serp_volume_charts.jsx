/* eslint-disable */
import React, {PureComponent} from "react";
import OrdersToday from "../../containers/Dashboards/ECommerce/components/OrdersToday";
import {Col} from "reactstrap";
import * as PropTypes from "prop-types";

export default class SerpVolumeCharts extends PureComponent
{
    constructor(props)
    {
        super(props);
    }

    static propTypes = {
      trends: PropTypes.array.isRequired,
      volume: PropTypes.number.isRequired,
      loaded: PropTypes.bool.isRequired,
      debutDate: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.object
      ])
    };

    render() {
        return (
            <Col xs={12} md={12} lg={12} xl={3}>
                <OrdersToday trends={this.props.trends}
                             volume={this.props.volume}
                             loaded={this.props.loaded}
                             debutDate={this.props.debutDate} />
            </Col>
        )
    }
}
