/* eslint-disable */
import React, {PureComponent} from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import Panel from '../../../../shared/components/Panel';

class CryptotrendsToday extends PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        const data = this.props.data.slice(0, 7).map((d, item) => {
          return {
            name: d.anchor,
              value: d.backlinks_num,
              fill: item === 0 ? "#f6da6e" :
                    item === 1 ? "#70bbfd" :
                    item === 2 ? "#4ce1b6" :
                    item === 3 ? "#2c3e50" :
                    item === 4 ? "#c88ffa" :
                    item === 5 ? "#ff4861" :
                    item === 6 ? "#F4A460" : ''
          }
        });

        const style = {
            left: 0,
            width: 150,
            lineHeight: '24px',
        };

        const renderLegend = ({ payload }) => (
            <ul className="dashboard__chart-legend">
                {
                    payload.map((entry, index) => (
                        <li key={`item-${index}`}><span style={{ backgroundColor: entry.color }} />{entry.value}</li>
                    ))
                }
            </ul>
        );

        renderLegend.propTypes = {
            payload: PropTypes.arrayOf(PropTypes.shape({
                color: PropTypes.string,
                vslue: PropTypes.string,
            })).isRequired,
        };
        return (
            <Panel
                lg={12}
                xl={8}
                xs={12}
                serpFeature={[]}
                title='Anchors Chart'
                subhead="Top selling items statistic by last month"
            >
                <ResponsiveContainer className="dashboard__chart-pie dashboard__chart-pie--crypto" height={360}>
                    <PieChart className="dashboard__chart-pie-container">
                        <Tooltip formatter={value => (`${value.toFixed(2)}`)} />
                        <Pie
                            data={data}
                            dataKey="value"
                            cy={175}
                            innerRadius={130}
                            outerRadius={160}
                        />
                        <Legend layout="vertical" verticalAlign="bottom" wrapperStyle={style} content={renderLegend} />
                    </PieChart>
                </ResponsiveContainer>
            </Panel>
        );
    }
}

export default translate('common')(CryptotrendsToday);
