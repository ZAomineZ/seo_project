/* eslint-disable no-return-assign */
/* eslint-disable */
import React, {Component} from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Topbar from './topbar/Topbar';
import TopbarWithNavigation from './topbar_with_navigation/TopbarWithNavigation';
import Sidebar from './sidebar/Sidebar';
import SidebarMobile from './topbar_with_navigation/sidebar_mobile/SidebarMobile';
import Customizer from './customizer/Customizer';
import {changeMobileSidebarVisibility, changeSidebarVisibility} from '../../redux/actions/sidebarActions';
import {changeThemeToDark, changeThemeToLight} from '../../redux/actions/themeActions';
import {changeBorderRadius, toggleBoxShadow, toggleTopNavigation} from '../../redux/actions/customizerActions';
import {CustomizerProps, SidebarProps, ThemeProps} from '../../shared/prop-types/ReducerProps';
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import axios from "axios";

let notification = null;

const showNotification = (message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title={type === 'danger' ? '👋 A Error is present !!!' : '👋 Well done !!!'}
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class Layout extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        sidebar: SidebarProps.isRequired,
        customizer: CustomizerProps.isRequired,
        theme: ThemeProps.isRequired,
    };

    constructor() {
        super();
        this.state = {
            auth: '',
        }
    }

    getCookie(name_cookie) {
        let name = name_cookie + '=';
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let cook = cookie[i];
            while (cook.charAt(0) == ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) == 0) {
                return cook.substring(name.length, cook.length);
            }
            return '';
        }
    }

    componentDidMount() {
        if (this.getCookie('remember_me_auth') !== '') {
            if (!sessionStorage.getItem('Auth')) {
                let split_string = this.getCookie('remember_me_auth').split('__');
                let id = split_string[1];
                if (id !== '') {
                    axios.get('http://' + window.location.hostname + '/ReactProject/App/Ajax/Auth/ReconnectCookie.php', {
                        params: {
                            'id': id
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then((response) => {
                        if (response && response.status === 200) {
                            if (response.data !== '') {
                                let JSON_DECODE = JSON.stringify(response.data);
                                sessionStorage.setItem('Auth', JSON_DECODE);
                                sessionStorage.setItem('Remember_me', 'TRUE');
                                NotificationSystem.newInstance({}, n => notification = n);
                                setTimeout(() => showNotification('You are connected !!!', 'success'), 700);
                            }
                        }
                    })
                }
            } else {
                //
            }
        } else {
            if (this.getCookie('auth_today') !== '') {
                if (!sessionStorage.getItem('Auth')) {
                    let split_string = this.getCookie('auth_today').split('__');
                    let id = split_string[1];
                    if (id !== '') {
                        axios.get('http://' + window.location.hostname + '/ReactProject/App/Ajax/Auth/ReconnectCookie.php', {
                            params: {
                                'id': id
                            },
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then((response) => {
                            if (response && response.status === 200) {
                                if (response.data !== '') {
                                    let JSON_DECODE = JSON.stringify(response.data);
                                    sessionStorage.setItem('Auth', JSON_DECODE);
                                    sessionStorage.setItem('Remember_me', 'FALSE');
                                    NotificationSystem.newInstance({}, n => notification = n);
                                    setTimeout(() => showNotification('You are connected !!!', 'success'), 700);
                                }
                            }
                        })
                    }
                }
            } else {
                this.setState({auth: 'noAuth'});
                NotificationSystem.newInstance({}, n => notification = n);
                setTimeout(() => showNotification('You must be logged in to access this page !!!', 'danger'), 700);
            }
        }
    }

    DeleteCookieNotExist ()
    {
        sessionStorage.removeItem('Auth');
        sessionStorage.removeItem('Remember_me');
        this.setState({auth: 'noAuth'});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.getCookie('auth_today') === '' && this.getCookie('remember_me_auth') === '') {
            this.DeleteCookieNotExist()
        }
    }

    changeSidebarVisibility = () => {
        this.props.dispatch(changeSidebarVisibility());
    };

    changeMobileSidebarVisibility = () => {
        this.props.dispatch(changeMobileSidebarVisibility());
    };

    changeToDark = () => {
        this.props.dispatch(changeThemeToDark());
    };

    changeToLight = () => {
        this.props.dispatch(changeThemeToLight());
    };

    toggleTopNavigation = () => {
        this.props.dispatch(toggleTopNavigation());
    };

    changeBorderRadius = () => {
        this.props.dispatch(changeBorderRadius());
    };

    toggleBoxShadow = () => {
        this.props.dispatch(toggleBoxShadow());
    };

    render() {
        const {customizer, sidebar, theme} = this.props;
        const layoutClass = classNames({
            layout: true,
            'layout--collapse': sidebar.collapse,
            'layout--top-navigation': customizer.topNavigation,
        });

        if (this.state.auth === 'noAuth') {
            return (
                <Redirect to={{
                    pathname: '/log_in',
                }}/>
            );
        }

        const JSON_Format = JSON.parse(sessionStorage.getItem('Auth'));

        return (
            <div className={layoutClass}>
                <Customizer
                    customizer={customizer}
                    sidebar={sidebar}
                    theme={theme}
                    changeSidebarVisibility={this.changeSidebarVisibility}
                    toggleTopNavigation={this.toggleTopNavigation}
                    changeToDark={this.changeToDark}
                    changeToLight={this.changeToLight}
                    changeBorderRadius={this.changeBorderRadius}
                    toggleBoxShadow={this.toggleBoxShadow}
                />
                {this.props.customizer.topNavigation ?
                    <TopbarWithNavigation
                        changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
                        username_auth={sessionStorage.getItem('Auth') ? JSON_Format.username : ''}
                    /> :
                    <Topbar
                        changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
                        changeSidebarVisibility={this.changeSidebarVisibility}
                        username_auth={sessionStorage.getItem('Auth') ? JSON_Format.username : ''}
                    />
                }
                {this.props.customizer.topNavigation ?
                    <SidebarMobile
                        sidebar={sidebar}
                        changeToDark={this.changeToDark}
                        changeToLight={this.changeToLight}
                        changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
                    /> :
                    <Sidebar
                        sidebar={sidebar}
                        changeToDark={this.changeToDark}
                        changeToLight={this.changeToLight}
                        changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
                    />
                }
            </div>
        );
    }
}

export default withRouter(connect(state => ({
    customizer: state.customizer,
    sidebar: state.sidebar,
    theme: state.theme,
}))(Layout));
