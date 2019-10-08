/* eslint-disable */
import React, { PureComponent } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import Panel from '../../../../shared/components/Panel';
import OccupancyTooltipContent from './OccupancyTooltipContent';

class Occupancy extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    dash_stats: PropTypes.array.isRequired,
  };

  render() {
      let numbro = require('numbro');

      const { t, dash_stats } = this.props;

    return (
      <Panel
        xl={8}
        lg={12}
        md={12}
        title={t('Referring Domains')}
        subhead="See how effective your business is"
      >
        <ResponsiveContainer height={260}>
          <ComposedChart data={dash_stats} margin={{ top: 20, left: -15 }}>
            <XAxis dataKey="date" tickLine={false} padding={{ left: 20 }} />
            <YAxis tickLine={false}/>
            <Tooltip content={<OccupancyTooltipContent colorForKey={{ baclinks: '#555555' }} />} />
            <CartesianGrid vertical={false} />
            <Bar dataKey="" name="" fill="#f2f4f7" barSize={20} />
            <Line type="linear" name="Ip" dataKey="ip" stroke="#b8e986" />
            <Line type="linear" name="Referring_domain" dataKey="referring_domain" stroke="#48b5ff" />
          </ComposedChart>
        </ResponsiveContainer>
        <hr />
        <div>
          <Table responsive className="table dashboard__occupancy-table">
            <tbody>
              <tr>
                <td className="td-head">Date</td>
                  {
                    this.props.dash_stats.map(d => (
                        <td className="td-gray">{ d.date }</td>
                    ))
                  }
              </tr>
              <tr>
                <td className="td-head">Referring_domains</td>
                  {
                      this.props.dash_stats.map(d => (
                          <td className="td-blue">{ numbro(d.referring_domain).format({average: true, mantissa: 2}) }</td>
                      ))
                  }
              </tr>
              <tr>
                <td className="td-head">Ip</td>
                  {
                      this.props.dash_stats.map(d => (
                          <td className="td-green">{ numbro(d.ip_subnets).format({average: true, mantissa: 2}) }</td>
                      ))
                  }
              </tr>
              <tr>
                <td className="td-head">Backlinks</td>
                  {
                      this.props.dash_stats.map(d => (
                          <td className="td-gray">{ numbro(d.total_backlinks).format({average: true, mantissa: 2}) }</td>
                      ))
                  }
              </tr>
            </tbody>
          </Table>
        </div>
      </Panel>
    );
  }
}

export default translate('common')(Occupancy);
