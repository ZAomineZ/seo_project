/* eslint-disable */
import React, {Component} from 'react';
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
                    <SidebarCategory title="Keyword Analysis" icon='magnifier'>
                        <SidebarLink
                            title="Serp Dashboard"
                            route="/seo/serp"
                            onClick={this.hideSidebar}
                        />
                        <SidebarLink
                            title="RankTo"
                            route="/seo/rankTo"
                            onClick={this.hideSidebar}
                        />
                        <SidebarLink
                            title="Suggest"
                            route="/seo/suggest"
                            onClick={this.hideSidebar}
                        />
                        <SidebarLink
                            title="Top kw by Domains"
                            route="/seo/keyworddomains"
                            onClick={this.hideSidebar}
                        />
                    </SidebarCategory>
                    <SidebarCategory title='Domain Analysis' icon='unlink'>
                        <SidebarLink
                            title="Dashboard Analyse"
                            route="/seo/serp_analyse"
                            onClick={this.hideSidebar}
                        />
                        <SidebarLink
                            title="LinkProfile"
                            route="/seo/linkprofile"
                            onClick={this.hideSidebar}
                        />
                        <SidebarLink
                            title="Campaign"
                            route="/seo/campain"
                            onClick={this.hideSidebar}
                        />
                    </SidebarCategory>
                    <SidebarLink
                        title="Correlation"
                        icon="chart-bars"
                        route="/seo/correlationData"
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
