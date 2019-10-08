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
              route="/seo/serp"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="Dashboard Analyse"
              icon="heart"
              route="/seo/serp_analyse"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="Suggest"
              icon="store"
              route="/seo/suggest"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="LinkProfile"
              icon="rocket"
              route="/seo/linkprofile"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="Campaign"
              icon="smartphone"
              route="/seo/campain"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="Top kw by Domains"
              icon="diamond"
              route="/seo/keyworddomains"
              onClick={this.hideSidebar}
            />
            <SidebarLink
              title="RankTo"
              icon="map"
              route="/seo/rankTo"
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
