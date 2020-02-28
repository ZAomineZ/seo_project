/* eslint-disable */

import React, {PureComponent} from "react";
import {Card, CardBody, Col} from "reactstrap";
import {FlexibleWidthXYPlot, HorizontalGridLines, VerticalBarSeries, VerticalGridLines, XAxis, YAxis} from "react-vis";
import PropTypes from 'prop-types';

const dataColor = [
    {color: '#70bbfd'},
    {color: '#C88FFA'},
    {color: '#F6DA6E'},
    {color: '#d0ed57'},
    {color: '#a4de6c'}
];

export default class BarTopWebsite extends PureComponent
{
    constructor(props)
    {
        super(props);
    }

    static propTypes = {
      keywordData: PropTypes.array.isRequired
    };

    render() {
        const {keywordData} = this.props;

        let data = Object.values(keywordData);

        return (
            <Col xs={12} md={12} lg={12} xl={12}>
                <Card>
                    <CardBody>
                        <div className="card__title">
                            <h5 className="bold-text">Top Keywords</h5>
                        </div>
                        <div className="react-vis">
                            <FlexibleWidthXYPlot
                                xType="ordinal"
                                height={300}
                            >
                                <VerticalGridLines />
                                <HorizontalGridLines />
                                <XAxis />
                                <YAxis />
                                {
                                    data.length !== 0 &&
                                        data.map((d, i) => {
                                            return (
                                                <VerticalBarSeries
                                                    data={[
                                                        { x: 'Top 3', y: d[0].top_3 },
                                                        { x: 'Top 4-10', y: d[0].top_4_10 },
                                                        { x: 'Top 11-20', y: d[0].top_11_20 },
                                                        { x: 'Top 21-50', y: d[0].top_21_50 },
                                                        { x: 'Top 51-100', y: d[0].top_51_100 },
                                                    ]}
                                                    color={dataColor[i].color}
                                                />
                                            )
                                        })
                                }
                            </FlexibleWidthXYPlot>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        )
    }
}
