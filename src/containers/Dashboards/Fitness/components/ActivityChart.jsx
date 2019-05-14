/* eslint-disable */
import React, {PureComponent} from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Panel from '../../../../shared/components/Panel';

class ActivityChart extends PureComponent{
    static propTypes = {
      traffic: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
      const data = this.props.traffic.map(d => {
          return  { name: d.date, traffic: parseInt(d.traffic), keyword: parseInt(d.keyword)}
      });

        return (
            <Panel xs={12} lg={12} title="SEO Traffic">
                <ResponsiveContainer height={300} className="dashboard__area">
                    <AreaChart data={data} margin={{ top: 20, left: -15, bottom: 20 }}>
                        <XAxis dataKey="name" tickLine={false} />
                        <YAxis tickLine={false} />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid />
                        <Area name="traffic" type="monotone" dataKey="traffic" fill="#70bbfd" stroke="#70bbfd" fillOpacity={0.2} />
                        <Area name="keyword" type="monotone" dataKey="keyword" fill="#4ce1b6" stroke="#4ce1b6" fillOpacity={0.2} />
                    </AreaChart>
                </ResponsiveContainer>
            </Panel>
        );
    }

}

export default translate('common')(ActivityChart);
