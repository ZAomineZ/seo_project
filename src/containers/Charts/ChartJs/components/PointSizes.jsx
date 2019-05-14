/* eslint-disable */
import React, {PureComponent} from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import PropTypes from "prop-types";

class PointSizes extends PureComponent {
    static propTypes = {
        data_power: PropTypes.array.isRequired,
        date: PropTypes.array.isRequired,
    };

    constructor (props) {
        super(props);
    }

    render() {
        const data = {
            labels: this.props.date,
            datasets: [
                {
                    label: 'Power',
                    fill: false,
                    lineTension: 0.3,
                    backgroundColor: '#4BC0C0',
                    borderColor: '#4BC0C0',
                    borderWidth: 1,
                    pointBackgroundColor: '#4BC0C0',
                    pointHoverRadius: 6,
                    pointHoverBorderWidth: 1,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: this.props.data_power,
                },
            ],
        };
        return (
            <Col md={12} lg={12} xl={12}>
                <Card>
                    <CardBody>
                        <Line data={data} options={options} />
                    </CardBody>
                </Card>
            </Col>
        );
    }
}

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

export default translate('common')(PointSizes);
