/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

class DynamiclyRefreshedDoughnut extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    labels: PropTypes.array.isRequired,
    numb_item_first: PropTypes.number.isRequired,
    numb_item_second: PropTypes.number.isRequired,
  };

    constructor(props) {
    super(props);
    this.state = {
      data: {
              labels: this.props.labels,
              datasets: [{
                  data: [this.props.numb_item_first, this.props.numb_item_second],
                  backgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                  ],
                  hoverBackgroundColor: [
                      '#FF6384',
                      '#36A2EB',
                  ],
                  borderColor: 'rgba(255,255,255,0.54)',
              }],
          },
      intervalId: null,
    };
  }

    componentWillMount() {
    const intervalId = setInterval(() => {
      this.setState({ data: this.state.data });
    }, 4000);

    this.setState({ intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    const { t } = this.props;
     return (
      <Card>
        <CardBody>
          <div className="card__title">
            <h5 className="bold-text">{t('Doughnut Informations')}</h5>
          </div>
          <Doughnut data={this.state.data} />
        </CardBody>
      </Card>
    );
  }
}

export default translate('common')(DynamiclyRefreshedDoughnut);
