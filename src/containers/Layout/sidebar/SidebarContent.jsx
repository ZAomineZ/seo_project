import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  static propTypes = {
    changeToDark: PropTypes.func.isRequired,
    changeToLight: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    this.props.onClick();
  };

  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink
            title="Serp Dashboard"
            icon="home"
            route="/serp"
            onClick={this.hideSidebar}
          />
          <SidebarLink
            title="Dashboard Analyse"
            icon="heart"
            route="/serp_analyse"
            onClick={this.hideSidebar}
          />
          <SidebarLink
            title="Suggest"
            icon="store"
            route="/suggest"
            onClick={this.hideSidebar}
          />
          <SidebarLink
            title="Crawl"
            icon="apartment"
            route="/crawl"
            onClick={this.hideSidebar}
          />
          <SidebarLink
            title="LinkProfile"
            icon="rocket"
            route="/linkprofile"
            onClick={this.hideSidebar}
          />
          <SidebarLink
            title="Campain"
            icon="smartphone"
            route="/campain"
            onClick={this.hideSidebar}
          />
          <SidebarLink
            title="Top kw by Domains"
            icon="diamond"
            route="/keyworddomains"
            onClick={this.hideSidebar}
          />
          <SidebarCategory title="Switch layout" icon="layers">
            <button className="sidebar__link" onClick={this.props.changeToLight}>
              <p className="sidebar__link-title">Light Theme</p>
            </button>
            <button className="sidebar__link" onClick={this.props.changeToDark}>
              <p className="sidebar__link-title">Dark Theme</p>
            </button>
          </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
