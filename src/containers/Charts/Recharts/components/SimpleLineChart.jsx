/* eslint-disable */
import React, {PureComponent} from 'react';
import {Card, CardBody, Col} from 'reactstrap';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';

const CustomTooltip = ({active, payload, label}) => {
    if (active && payload.length !== 0) {
        return (
            <div className="recharts-default-tooltip recharts-block-open">
                <p className="recharts-tooltip-label" style={{margin: '0px'}}>{label}</p>
                <ul className="recharts-tooltip-item-list" style={{padding: '0px', margin: '0px'}}>
                    {
                        payload.map(d => {
                            return (
                                <li className="recharts-tooltip-item recharts-item">
                                    <span className="recharts-tooltip-item-name"
                                          style={{color: d.stroke}}>{d.name}</span>
                                    <span className="recharts-tooltip-item-separator"> : </span>
                                    <span className="recharts-tooltip-item-value" style={{color: d.stroke}}>
                                        {d.value === 0 ? 'OUT' : d.value}
                                    </span>
                                    <span className="recharts-tooltip-item-unit"></span>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }

    return null;
};

class SimpleLineChart extends PureComponent {
    static propTypes = {
        date_array: PropTypes.array.isRequired,
        rank_object: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        data_url: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let array_rank = [];
        const data_title = nextProps.data_url.slice(0, 10).map(d => {
            return {
                title: this.TitleTransform(d)
            }
        });
        this.setState({
            data: nextProps.date_array.slice(nextProps.date_array.length >= 7 ? nextProps.date_array.length - 7 : 0, nextProps.date_array.length).map((d, key) => {
                let dt = nextProps.rank_object[d];
                let array_dt = dt.slice(0, 10);
                array_rank[key] = Object.entries(array_dt).map((data, k) => {
                    return {
                        rank: k + 1,
                        title: this.TitleTransform(data[1])
                    };
                });
                return {
                    name: d,
                    dt_1: array_rank[key].filter(d => d.title === data_title[0].title) ?
                        array_rank[key].filter(d => d.title === data_title[0].title) === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[0].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[0].title)[0].rank
                        : 0,
                    dt_2: array_rank[key].filter(d => d.title === data_title[1].title) ?
                        array_rank[key].filter(d => d.title === data_title[1].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[1].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[1].title)[0].rank
                        : 0,
                    dt_3: array_rank[key].filter(d => d.title === data_title[2].title) ?
                        array_rank[key].filter(d => d.title === data_title[2].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[2].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[2].title)[0].rank
                        : 0,
                    dt_4: array_rank[key].filter(d => d.title === data_title[3].title) ?
                        array_rank[key].filter(d => d.title === data_title[3].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[3].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[3].title)[0].rank
                        : 0,
                    dt_5: array_rank[key].filter(d => d.title === data_title[4].title) ?
                        array_rank[key].filter(d => d.title === data_title[4].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[4].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[4].title)[0].rank
                        : 0,
                    dt_6: array_rank[key].filter(d => d.title === data_title[5].title) ?
                        array_rank[key].filter(d => d.title === data_title[5].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[5].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[5].title)[0].rank
                        : 0,
                    dt_7: array_rank[key].filter(d => d.title === data_title[6].title) ?
                        array_rank[key].filter(d => d.title === data_title[6].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[6].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[6].title)[0].rank
                        : 0,
                    dt_8: array_rank[key].filter(d => d.title === data_title[7].title) ?
                        array_rank[key].filter(d => d.title === data_title[7].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[7].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[7].title)[0].rank
                        : 0,
                    dt_9: array_rank[key].filter(d => d.title === data_title[8].title) ?
                        array_rank[key].filter(d => d.title === data_title[8].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[8].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[8].title)[0].rank
                        : 0,
                    dt_10: array_rank[key].filter(d => d.title === data_title[9].title) ?
                        array_rank[key].filter(d => d.title === data_title[9].title)[0] === undefined
                            ? 0
                            : array_rank[key].filter(d => d.title === data_title[9].title)[0] === undefined
                            ? 0 : array_rank[key].filter(d => d.title === data_title[9].title)[0].rank
                        : 0,
                }
            })
        });
    }

    TitleTransform(title) {
        let title_dt = '';
        if (title) {
            let url_split = title.split('www.');
            if (url_split[1] !== undefined) {
                let title_split = url_split[1].split('/');
                title_dt = title_split[0]
            } else {
                let url_split = title.split('//');
                if (url_split[1] !== undefined) {
                    let title_split_2 = url_split[1].split('/');
                    title_dt = title_split_2[0]
                }
            }
            return title_dt;
        }
    }

    render() {
        let array_title = [];
        this.props.data_url.slice(0, 10).map((d, key) => {
            array_title[key] = this.TitleTransform(d)
        });
        return (
            <Col xs={12} md={12} lg={12} xl={12}>
                <Card>
                    <CardBody>
                        <div className="card__title">
                            <h5 className="bold-text">Simple Line Chart</h5>
                        </div>
                        <ResponsiveContainer height={300}>
                            <LineChart
                                data={this.state.data}
                                margin={{
                                    top: 0, right: 0, left: -15, bottom: 0,
                                }}
                            >
                                <XAxis dataKey="name"/>
                                <YAxis reversed/>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip content={<CustomTooltip/>}/>
                                <Legend/>
                                <Line type="monotone" name={array_title[0]} dataKey="dt_1" stroke="#4ce1b6"
                                      activeDot={{r: 8}}/>
                                <Line type="monotone" name={array_title[1]} dataKey="dt_2" stroke="#70bbfd"/>
                                <Line type="monotone" name={array_title[2]} dataKey="dt_3" stroke="#f6da6e"
                                      activeDot={{r: 6}}/>
                                <Line type="monotone" name={array_title[3]} dataKey="dt_4" stroke="#8A2BE2"/>
                                <Line type="monotone" name={array_title[4]} dataKey="dt_5" stroke="#D2691E"/>
                                <Line type="monotone" name={array_title[5]} dataKey="dt_6" stroke="#00008B"/>
                                <Line type="monotone" name={array_title[6]} dataKey="dt_7" stroke="#556B2F"/>
                                <Line type="monotone" name={array_title[7]} dataKey="dt_8" stroke="#8B0000"/>
                                <Line type="monotone" name={array_title[8]} dataKey="dt_9" stroke="#483D8B"/>
                                <Line type="monotone" name={array_title[9]} dataKey="dt_10" stroke="#FF1493"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </Col>
        );
    }

}

export default translate('common')(SimpleLineChart);
