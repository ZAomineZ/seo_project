/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

class BarCampainDetails extends PureComponent {
    static propTypes = {
      t: PropTypes.func.isRequired,
      data: PropTypes.array.isRequired,
    };

    constructor() {
      super();
      this.state = {
        intervalId: null,
      };
    }

    render() {
      const { t, data } = this.props;

        const initialState = {
            labels: data.map(d => d.date),
            datasets: [
                {
                    label: 'Cost $',
                    backgroundColor: '#FF6384',
                    borderColor: '#FF6384',
                    borderWidth: 1,
                    hoverBackgroundColor: '#FF6384',
                    hoverBorderColor: '#FF6384',
                    data: data.map(d => d.cost),
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
              <div className="card__title">
                <h5 className="bold-text">{t('charts.react_chartjs.random_animated_bars')}</h5>
              </div>
              <Bar width={200} height={75} data={initialState} options={options} />
            </CardBody>
          </Card>
        </Col>
      );
    }
}

export default translate('common')(BarCampainDetails);
