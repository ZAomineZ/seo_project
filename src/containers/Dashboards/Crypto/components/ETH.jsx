/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody } from 'reactstrap';
import { AreaChart, Tooltip, Area, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from 'mdi-react/TrendingUpIcon';
import PropTypes from 'prop-types';
import TrendingDownIcon from "mdi-react/TrendingDownIcon";

export default class ETH extends PureComponent {
    static propTypes = {
        dash_stats: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        };
    }

    render() {
        const Top = <TrendingUpIcon className="dashboard__trend-icon" />;
        const Bottom = <TrendingDownIcon className="dashboard__trend-icon" />;

        const data = this.props.dash_stats.map(d => {
            return { name: '', eth : d.score_rank };
        });

        const CustomTooltip = ({ active, payload }) => {
            if (active) {
                return (
                    <div className="dashboard__total-tooltip">
                        <p className="label">{`$${payload[0].value}`}</p>
                    </div>
                );
            }

            return null;
        };

        CustomTooltip.propTypes = {
            active: PropTypes.bool,
            payload: PropTypes.arrayOf(PropTypes.shape({
                value: PropTypes.number,
            })),
        };

        CustomTooltip.defaultProps = {
            active: false,
            payload: null,
        };
        return (
            <Card>
                <CardBody className="dashboard__card-widget">
                    <div className="card__title">
                        <h5 className="bold-text">Rank</h5>
                        <h5 className="subhead">Score Rank</h5>
                    </div>
                    <div className="dashboard__total dashboard__total--area">
                        {
                            data[data.length - 2] === undefined ? '' : data[data.length - 2].eth < data[data.length - 1].eth ? Top : data[data.length - 2].eth === data[data.length - 1].eth ? '' : Bottom
                        }
                        { data[data.length - 2] !== undefined ? <p className="dashboard__total-stat"> { Math.abs(data[data.length - 2].eth - data[data.length - 1].eth) } </p> : <p className="dashboard__total-stat"> 0 </p>}
                        <ResponsiveContainer height={70} className="dashboard__chart-container">
                            <AreaChart data={data} margin={{ top: 0, left: 0, bottom: 0 }}>
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    name="ETH"
                                    type="monotone"
                                    dataKey="eth"
                                    fill="#f198ca"
                                    stroke="#f198ca"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

