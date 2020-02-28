/* eslint-disable */

import React, {PureComponent} from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import Panel from '../../../shared/components/Panel';
import PropTypes from 'prop-types';

export class ChartTrafficByWebsite extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataWebsite: []
        }
    }

    static propTypes = {
        trafficData: PropTypes.array.isRequired
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps && nextProps.trafficData.length !== 0) {
            let dataTraffic = Object.values(nextProps.trafficData);
            let data = [];

            dataTraffic.map((value) => {
                value.map((v, i) => {
                    data[i] = {
                        name: v.date,
                        domain: v.domain,

                        traffic_website1: dataTraffic[0]
                            ? dataTraffic[0][i]
                                ? dataTraffic[0][i].traffic
                                : 0
                            : 0,
                        traffic_website2: dataTraffic[1]
                            ? dataTraffic[1][i]
                                ? dataTraffic[1][i].traffic
                                : 0
                            : 0,
                        traffic_website3: dataTraffic[2]
                            ? dataTraffic[2][i]
                                ? dataTraffic[2][i].traffic
                                : 0
                            : 0,
                        traffic_website4: dataTraffic[3]
                            ? dataTraffic[3][i]
                                ? dataTraffic[3][i].traffic
                                : 0
                            : 0,
                        traffic_website5: dataTraffic[4]
                            ? dataTraffic[4][i]
                                ? dataTraffic[4][i].traffic
                                : 0 :
                            0
                    }
                });
            });

            this.setState({
                data: data,
                dataWebsite: dataTraffic
            })
        }
    }

    render() {
        const {data, dataWebsite} = this.state;

        return (
            <Panel xs={12} lg={12} title="Organic Traffic" serpFeature={[]}>
                <ResponsiveContainer height={300} className="dashboard__area">
                    <AreaChart data={data} margin={{top: 20, left: -15, bottom: 20}}>
                        <XAxis dataKey="name" tickLine={false}/>
                        <YAxis tickLine={false} type="number" domain={['auto', 'auto']} width={70}/>
                        <Tooltip/>
                        <Legend/>
                        <CartesianGrid/>
                        {
                            dataWebsite[0] && dataWebsite[0][dataWebsite[0].length - 1] &&
                            <Area name={dataWebsite[0][dataWebsite[0].length - 1].domain} type="monotone"
                                  dataKey="traffic_website1"
                                  fill="#70bbfd" stroke="#70bbfd"
                                  fillOpacity={0.2}/>
                        }
                        {
                            dataWebsite[1] && dataWebsite[1][dataWebsite[1].length - 1] &&
                            <Area name={dataWebsite[1][dataWebsite[1].length - 1].domain} type="monotone"
                                  dataKey="traffic_website2"
                                  fill="#C88FFA" stroke="#C88FFA"
                                  fillOpacity={0.2}/>
                        }
                        {
                            dataWebsite[2] && dataWebsite[2][dataWebsite[2].length - 1] &&
                            <Area name={dataWebsite[2][dataWebsite[2].length - 1].domain} type="monotone"
                                  dataKey="traffic_website3"
                                  fill="#F6DA6E" stroke="#F6DA6E"
                                  fillOpacity={0.2}/>
                        }
                        {
                            dataWebsite[3] && dataWebsite[3][dataWebsite[3] .length - 1] &&
                            <Area name={dataWebsite[3][dataWebsite[3] .length - 1].domain} type="monotone"
                                  dataKey="traffic_website4"
                                  fill="#d0ed57" stroke="#70bbfd"
                                  fillOpacity={0.2}/>
                        }
                        {
                            dataWebsite[4] && dataWebsite[4][dataWebsite[4].length - 1] &&
                            <Area name={dataWebsite[4][dataWebsite[4].length - 1].domain} type="monotone"
                                  dataKey="traffic_website5"
                                  fill="#a4de6c" stroke="#70bbfd"
                                  fillOpacity={0.2}/>
                        }
                    </AreaChart>
                </ResponsiveContainer>
            </Panel>
        )
    }
}
