/* eslint-disable */
import React, {PureComponent} from 'react';
import { Card, CardBody } from 'reactstrap';
import {
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  FlexibleWidthXYPlot,
  YAxis,
} from 'react-vis';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

class Bar extends PureComponent {
    static propTypes = {
        domain_stat: PropTypes.array.isRequired
    };

    constructor () {
        super()
    }

    render() {
        const data = this.props.domain_stat.map(d => {
           return { x: d.date, y: parseInt(d.newLinks) }
        });

        const data_2 = this.props.domain_stat.map(d => {
           return { x: d.date, y: -parseInt(d.lostLinks) }
        });
        return (
            <Card>
                <CardBody>
                    <div className="card__title">
                        <h5 className="bold-text">Chart lost and new Backlink</h5>
                    </div>
                    <div className="react-vis">
                        <FlexibleWidthXYPlot
                            xType="ordinal"
                            height={280}
                            xDistance={100}
                        >
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis marginLeft={55} />
                            <YAxis type="number" domain={['auto', 'auto']} width={60} />
                            <VerticalBarSeries
                                data={data}
                                color="#70bbfd"
                                marginLeft={55}
                            />
                            <VerticalBarSeries
                                data={data_2}
                                color="#c88ffa"
                                marginLeft={55}
                            />
                        </FlexibleWidthXYPlot>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default translate('common')(Bar);
