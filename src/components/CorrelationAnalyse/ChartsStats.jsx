/* eslint-disable */
import React, {PureComponent} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import {
    HorizontalGridLines, MarkSeries, VerticalGridLines, XAxis, FlexibleWidthXYPlot, YAxis,
} from 'react-vis';
import PropTypes from 'prop-types';

function getRandomData(data) {
    return data.map((d, k) => ({
        x: d.value,
        y: k + 1,
        size: d.value * 10,
        color: Math.random() * 10,
        opacity: (Math.random() * 0.5) + 0.5,
    }));
}

class MarkSeriesCanvas extends PureComponent
{
    constructor(){
        super();
    }

    static propTypes = {
        data: PropTypes.array.isRequired
    };

    render() {
        return (
            <Col xs={12} md={12} lg={12} xl={12}>
                <Card>
                    <CardBody>
                        <div className="react-vis" dir="ltr">
                            <FlexibleWidthXYPlot
                                height={350}
                            >
                                <VerticalGridLines />
                                <HorizontalGridLines />
                                <XAxis />
                                <YAxis />
                                <MarkSeries
                                    className="mark-series-example"
                                    strokeWidth={2}
                                    opacity="0.8"
                                    sizeRange={[5, 15]}
                                    data={getRandomData(this.props.data)}
                                    colorRange={['#70bbfd', '#c88ffa']}
                                />
                            </FlexibleWidthXYPlot>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}

export default (MarkSeriesCanvas);
