/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

class RandomAnimatedBars extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    anchor_data: PropTypes.array.isRequired,
    anchor_label: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: {
        labels: this.props.anchor_label,
        datasets: [
          {
            label: 'Anchors',
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
            borderWidth: 1,
            hoverBackgroundColor: '#FF6384',
            hoverBorderColor: '#FF6384',
            data: this.props.anchor_data,
          },
        ],
      },
    };
  }

  render() {
    const { t } = this.props;
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
      <Col md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <div className="card__title">
              <h5 className="bold-text">{t('charts.react_chartjs.random_animated_bars')}</h5>
            </div>
            <Bar data={this.state.data} options={options} />
          </CardBody>
        </Card>
      </Col>
    );
  }
}

export default translate('common')(RandomAnimatedBars);
