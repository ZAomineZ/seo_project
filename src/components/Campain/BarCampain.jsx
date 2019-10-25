/* eslint-disable no-underscore-dangle,react/no-did-mount-set-state */
/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

class BarCampain extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  constructor() {
    super();
  }

  render() {
    const initialState = {
      labels: this.props.data.map(d => d.name),
      datasets: [
        {
          label: 'Cost $',
          backgroundColor: '#FF6384',
          borderColor: '#FF6384',
          borderWidth: 1,
          hoverBackgroundColor: '#FF6384',
          hoverBorderColor: '#FF6384',
          data: this.props.data.map(d => d.cost),
        },
      ],
    };

    const options = {
      legend: {
        position: 'bottom',
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: 'rgb(204, 204, 204)',
              borderDash: [3, 3],
            },
            ticks: {
              fontColor: 'rgb(204, 204, 204)',
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: 'rgb(204, 204, 204)',
              borderDash: [3, 3],
            },
            ticks: {
              fontColor: 'rgb(204, 204, 204)',
            },
          },
        ],
      },
    };
    return (
      <Col md={12} lg={12} xl={12} className={'chart-top'}>
        <Card>
          <CardBody>
            <Bar width={200} height={75} data={initialState} options={options} />
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default translate('common')(BarCampain);
