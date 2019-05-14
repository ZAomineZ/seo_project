/* eslint-disable */
import React, { PureComponent } from 'react';
import { Card, CardBody, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import CaloriesBurn from '../../containers/Dashboards/Fitness/components/CaloriesBurn';
import ETH from '../../containers/Dashboards/Crypto/components/ETH';

class DefaultTabs extends PureComponent {
    static propTypes = {
      t: PropTypes.func.isRequired,
      score_rank: PropTypes.number.isRequired,
      dash_stats: PropTypes.array.isRequired,
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
          xl={3}
          lg={6}
          sm={12}
          xs={12}
        >
          <Card>
            <CardBody>
              <div className="tabs">
                <div className="tabs__wrap">
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '1' })}
                        onClick={() => {
                                                this.toggle('1');
                                            }}
                      >
                        {t('Score')}
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === '2' })}
                        onClick={() => {
                                                this.toggle('2');
                                            }}
                      >
                                            DashBoard
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                      <CaloriesBurn score_rank={this.props.score_rank} />
                    </TabPane>
                    <TabPane tabId="2">
                      <ETH dash_stats={this.props.dash_stats} />
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      );
    }
}

export default translate('common')(DefaultTabs);
