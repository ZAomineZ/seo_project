/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Card, CardBody } from 'reactstrap';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import TrendingUpIcon from 'mdi-react/TrendingUpIcon';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

const data = [
  { name: 'Page A', uv: 4000 },
  { name: 'Page B', uv: 3000 },
  { name: 'Page C', uv: 2000 },
  { name: 'Page D', uv: 2780 },
  { name: 'Page E', uv: 1890 },
  { name: 'Page F', uv: 2390 },
  { name: 'Page G', uv: 3490 },
  { name: 'Page H', uv: 2000 },
  { name: 'Page I', uv: 2780 },
  { name: 'Page J', uv: 1890 },
];

class TotalProducts extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      activeIndex: 0,
    };
  }

  handleClick = (index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    const { activeIndex } = this.state;
    const activeItem = data[activeIndex];
    const { t } = this.props;

    return (
      <Card>
        <CardBody className="dashboard__card-widget">
          <div className="card__title">
            <h5 className="bold-text">{t('dashboard_commerce.total_products')}</h5>
          </div>
          <div className="dashboard__total">
            <TrendingUpIcon className="dashboard__trend-icon" />
            <p className="dashboard__total-stat">
              {activeItem.uv}
            </p>
            <ResponsiveContainer height={50} className="dashboard__chart-container">
              <BarChart data={data}>
                <Bar dataKey="uv" onClick={this.handleClick}>
                  {
                      data.map((entry, index) => (
                        <Cell
                          cursor="pointer"
                          fill={index === activeIndex ? '#4ce1b6' : '#ff4861'}
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

export default translate('common')(TotalProducts);
