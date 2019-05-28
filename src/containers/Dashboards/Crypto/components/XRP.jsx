/* eslint-disable */
import React, { PureComponent } from 'react';
import { CardBody, Card } from 'reactstrap';
import { AreaChart, Tooltip, Area, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from 'mdi-react/TrendingUpIcon';
import TrendingDownIcon from "mdi-react/TrendingDownIcon";
import PropTypes from 'prop-types';

export default class XRP extends PureComponent {
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
            return { name: '', xrp : d.referring_domain };
        });

        const CustomTooltip = ({ active, payload }) => {
            if (active) {
                return (
                    <div className="dashboard__total-tooltip">
                        <p className="label">{`${payload[0].value}`}</p>
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
                        <h5 className="bold-text">Domains</h5>
                        <h5 className="subhead">Referring Domains</h5>
                    </div>
                    <div className="dashboard__total dashboard__total--area">
                        {
                            data[data.length - 2] === undefined ? '' : data[data.length - 2].xrp < data[data.length - 1].xrp ? Top : data[data.length - 2].xrp === data[data.length - 1].xrp ? '' : Bottom
                        }
                        { data[data.length - 2] !== undefined ? <p className="dashboard__total-stat"> { Math.abs(data[data.length - 2].xrp - data[data.length - 1].xrp) } </p> : <p className="dashboard__total-stat"> 0 </p>}
                        <ResponsiveContainer height={70} className="dashboard__chart-container">
                            <AreaChart data={data} margin={{ top: 0, left: 0, bottom: 0 }}>
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    name="XRP"
                                    type="monotone"
                                    dataKey="xrp"
                                    fill="#c39fdf"
                                    stroke="#c39fdf"
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




