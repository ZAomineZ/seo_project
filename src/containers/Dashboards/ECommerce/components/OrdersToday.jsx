/* eslint-disable react/no-array-index-key */
/* eslint-disable */
import React, {PureComponent} from 'react';
import {Card, CardBody} from 'reactstrap';
import {Bar, BarChart, Cell, ResponsiveContainer} from 'recharts';
import TrendingDownIcon from 'mdi-react/TrendingDownIcon';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import TrendingUpIcon from "mdi-react/TrendingUpIcon";

class OrdersToday extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 14,
            volume: 0,
            data: []
        };
    }

    static propTypes = {
        t: PropTypes.func.isRequired,
        trends: PropTypes.array.isRequired,
        volume: PropTypes.number.isRequired,
        loaded: PropTypes.bool.isRequired,
        debutDate: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ])
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.trends) {
            const data = [];
            nextProps.trends.map((value, index) => {
                data[index] = {
                    name: index,
                    value: value
                };
            });

            const newData = data.slice(data.length - 15, data.length);

            this.setState({
                data: newData,
                volume: nextProps.volume
            })
        }

        if (nextProps && nextProps.debutDate && nextProps.trends.length !== 0) {
            let dateToday = new Date();
            let dateStart = new Date(nextProps.debutDate);

            let dateStartFormat = new Date(dateStart.getFullYear(), dateStart.getMonth());
            let dateTodayFormat = new Date(dateToday.getFullYear(), dateToday.getMonth());
            let diffDateMonth = this.monthDiff(dateStartFormat, dateTodayFormat);

            let indexDiffMonth = (this.state.activeIndex - diffDateMonth);

            this.setState({activeIndex: indexDiffMonth});
        }
    }

    monthDiff(dateFrom, dateTo) {
        return dateTo.getMonth() - dateFrom.getMonth() +
            (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    }

    handleClick = (item) => {
        const index = this.state.data.indexOf(item.payload);
        this.setState({
            activeIndex: index,
        });
    };

    render() {
        const {data, volume, activeIndex} = this.state;

        return (
            <Card>
                <CardBody className="dashboard__card-widget">
                    {!this.props.loaded &&
                    <div className="panel__refresh">
                        <svg className="mdi-icon " width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,4V2C6.48,2 2,6.48 2,12H4C4,7.58 7.58,4 12,4Z"></path>
                        </svg>
                    </div>
                    }
                    <div className="card__title">
                        <h5 className="bold-text">Insights</h5>
                        <h5 className="subhead">Search volume && trends</h5>
                    </div>
                    <div className="dashboard__total">
                        {
                            data[activeIndex] && activeIndex !== 0 ?
                                Math.sign(data[activeIndex].value - data[activeIndex - 1].value) === 0 ?
                                    <p className="dashboard__total-stat cl_green"
                                       style={{marginTop: '0', marginRight: '0'}}>= </p>
                                    :
                                    Math.sign(data[activeIndex].value - data[activeIndex - 1].value) === -1
                                        ?
                                        <TrendingDownIcon className="dashboard_top_serp_icon" style={{marginTop: '0'}}/>
                                        : <TrendingUpIcon className="dashboard__trend-icon" style={{marginTop: '0'}}/>
                                : <p className="dashboard__total-stat cl_green"
                                     style={{marginTop: '0', marginRight: '0'}}>=</p>
                        }
                        <p className="dashboard__total-stat" style={{marginTop: '0'}}>
                            {data[activeIndex] ? Math.round((volume / (data[data.length - 1].value / 100)) * (data[activeIndex].value / 100)) : volume}
                        </p>
                        <ResponsiveContainer height={150} width={200} className="dashboard__chart-container">
                            <BarChart data={data}>
                                <Bar dataKey="value" onClick={this.handleClick}>
                                    {
                                        data.map((entry, index) => (
                                            <Cell
                                                cursor="pointer"
                                                fill={index === activeIndex ? '#4ce1b6' : '#c88ffa'}
                                                key={`cell-${index}`}
                                            />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default translate('common')(OrdersToday);
