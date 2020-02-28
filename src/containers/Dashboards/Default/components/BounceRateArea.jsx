/* eslint-disable */
import React, {PureComponent} from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {translate} from 'react-i18next';
import PropTypes from 'prop-types';
import Panel from '../../../../shared/components/Panel';

class BounceRateArea extends PureComponent {
    static propTypes = {
        domain_stat: PropTypes.array.isRequired
    };

    constructor() {
        super();
    }

    render() {
        const data = this.props.domain_stat.map(d => {
            return {name: d.date, totalLinks: parseInt(d.totalLinks)}
        });

        return (
            <Panel xl={5} lg={6} md={12} title="Dashboard Backlinks" serpFeature={[]}>
                <ResponsiveContainer height={220} className="dashboard__area">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 0, right: 0, left: -15, bottom: 0,
                        }}
                    >
                        <XAxis dataKey="name" tickLine={false} />
                        <YAxis tickLine={false} type="number" domain={['auto', 'auto']} width={70}/>
                        <CartesianGrid vertical={false} />
                        <Tooltip/>
                        <Area type="monotone" dataKey="totalLinks" name="totalLinks" stroke="#24d6a3" fill="#4ce1b6" fillOpacity={0.2}/>
                    </AreaChart>
                </ResponsiveContainer>
            </Panel>
        );
    }
}

export default translate('common')(BounceRateArea);
