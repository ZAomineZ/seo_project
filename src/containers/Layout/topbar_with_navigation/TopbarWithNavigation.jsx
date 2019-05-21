/* eslint-disable */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import TopbarNav from './tobar_nav/TopbarNav';

export default class TopbarWithNavigation extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    username_auth: PropTypes.string.isRequired
  };

  render() {
    const { changeMobileSidebarVisibility } = this.props;

    return (
      <div className="topbar topbar--navigation">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton changeMobileSidebarVisibility={changeMobileSidebarVisibility} />
            <Link className="topbar__logo" to="/dashboard_default" />
          </div>
          <TopbarNav />
          <div className="topbar__right">
            <TopbarProfile username={this.props.username_auth}/>
          </div>
        </div>
      </div>
    );
  }
}
