/* eslint-disable */
import React, { PureComponent } from 'react';
import { Col } from 'reactstrap';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import BounceRateArea from '../../containers/Dashboards/Default/components/BounceRateArea';

class DefaultTabs extends PureComponent {
    static propTypes = {
      t: PropTypes.func.isRequired,
      domain_stat: PropTypes.array.isRequired,
    };

    constructor() {
      super();
      this.state = {
        activeTab: '1',
      };
    }

    toggle = (tab) => {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab,
        });
      }
    };

    render() {
      const { t } = this.props;

      return (
        <Col
          md={12}
          xl={6}
          lg={6}
          sm={12}
          xs={12}
        >
            <BounceRateArea domain_stat={this.props.domain_stat}/>
        </Col>
      );
    }
}

export default translate('common')(DefaultTabs);
