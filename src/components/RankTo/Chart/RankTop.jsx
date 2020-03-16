/* eslint-disable */
import React, {PureComponent} from 'react'
import {Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import Panel from "../../../shared/components/Panel";
import PropTypes from "prop-types";

export default class RankTop extends PureComponent
{
    constructor(props)
    {
        super(props)
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        nameTop: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        color: PropTypes.string.isRequired
    };

    render() {
        const {title, nameTop, data, color} = this.props;

        return (
            <Panel xs={12} lg={12}
                   serpFeature={[]}
                   title={title}>
                <ResponsiveContainer height={300} className="dashboard__area">
                    <AreaChart data={data} margin={{top: 20, left: -15, bottom: 20}}>
                        <XAxis dataKey="name" tickLine={false}/>
                        <YAxis tickLine={false} type="number" domain={['auto', 'auto']}
                               width={70}/>
                        <Tooltip/>
                        <Legend/>
                        <CartesianGrid/>
                        <Area name={nameTop} type="monotone" dataKey={nameTop} fill={color}
                              stroke={color} fillOpacity={0.2}/>
                    </AreaChart>
                </ResponsiveContainer>
            </Panel>
        )
    }
}
