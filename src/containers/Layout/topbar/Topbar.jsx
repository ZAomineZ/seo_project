/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';

class Topbar extends PureComponent {
  static propTypes = {
    changeMobileSidebarVisibility: PropTypes.func.isRequired,
    changeSidebarVisibility: PropTypes.func.isRequired,
    username_auth: PropTypes.string.isRequired,
    gender_auth: PropTypes.string.isRequired
  };

  render() {
    const { changeMobileSidebarVisibility, changeSidebarVisibility } = this.props;

    return (
      <div className="topbar">
        <div className="topbar__wrapper">
          <div className="topbar__left">
            <TopbarSidebarButton
              changeMobileSidebarVisibility={changeMobileSidebarVisibility}
              changeSidebarVisibility={changeSidebarVisibility}
            />
          </div>
          <div className="topbar__right">
            <TopbarProfile username={this.props.username_auth} gender={this.props.gender_auth} />
          </div>
        </div>
      </div>
    );
  }
}

export default Topbar;
