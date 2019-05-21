/* eslint-disable max-len */
/* eslint-disable */

import React, { PureComponent } from 'react';
import { Col, Row, Container } from 'reactstrap';
import scrollToComponent from 'react-scroll-to-component';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Header from './components/Header';
import Technologies from './components/Technologies';
import Demos from './components/Demos';
import Features from './components/Features';
import Purchase from './components/Purchase';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import FeatureRequest from './components/FeatureRequest';
import { changeThemeToDark, changeThemeToLight } from '../../redux/actions/themeActions';
import { ThemeProps } from '../../shared/prop-types/ReducerProps';
import NotificationSystem from "rc-notification";
import {BasicNotification} from "../../shared/components/Notification";
import {Redirect} from "react-router-dom";

const logo = `${process.env.PUBLIC_URL}/img/landing/logo_svg.svg`;

let notification = null;

const showNotification = (message, type) => {
    notification.notice({
        content: <BasicNotification
            color={type}
            title='👋 Danger !!!'
            message={message}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

class Landing extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    theme: ThemeProps.isRequired,
  };

    constructor() {
        super();
        this.state = {
            auth: ''
        }
    }

  componentDidMount() {
      if (sessionStorage.getItem('Auth')) {
          this.setState({auth: 'Auth'});
          NotificationSystem.newInstance({}, n => notification = n);
          setTimeout(() => showNotification('You are already connected, it is impossible to access page Home !!!', 'danger'), 700);
      }
  }

    changeToDark = () => {
    this.props.dispatch(changeThemeToDark());
  };

  changeToLight = () => {
    this.props.dispatch(changeThemeToLight());
  };

  render() {
    const { theme } = this.props;

      if (this.state.auth === 'Auth')  {
          return (
              <Redirect to={{
                  pathname: '/seo/serp',
              }}/>
          );
      }

    return (
      <div className="landing">
        <div className="landing__menu">
          <Container>
            <Row>
              <Col md={12}>
                <div className="landing__menu-wrap">
                  <p className="landing__menu-logo">
                    <img src={logo} alt="" />
                  </p>
                  <nav className="landing__menu-nav">
                    <button
                      onClick={() => scrollToComponent(this.About, { offset: -50, align: 'top', duration: 1000 })}
                    >
                      About EasyDEV
                    </button>
                    <button onClick={() => scrollToComponent(this.Features, {
                      offset: -50,
                      align: 'top',
                      duration: 1500,
                    })}
                    >
                      Features
                    </button>
                    <button
                      onClick={() => scrollToComponent(this.Demos, { offset: -50, align: 'top', duration: 2000 })}
                    >
                      Demos
                    </button>
                    <button
                      onClick={() => scrollToComponent(this.FeatureRequest, {
                        offset: -50,
                        align: 'top',
                        duration: 2500,
                      })}
                    >
                      Feature request <span className="landing__menu-nav-new" />
                    </button>
                    <a
                      className="landing__btn"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://themeforest.net/item/easypro-developer-friendly-react-bootstrap-4-admin-template/21798550"
                    >
                      Buy now for $25
                    </a>
                  </nav>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <Header onClick={() => scrollToComponent(this.Demos, { offset: -50, align: 'top', duration: 2000 })} />
        <span ref={(section) => {
          this.About = section;
        }}
        />
        <Technologies />
        <span ref={(section) => {
          this.Features = section;
        }}
        />
        <Features />
        <span ref={(section) => {
          this.Demos = section;
        }}
        />
        <Demos theme={theme} changeToDark={this.changeToDark} changeToLight={this.changeToLight} />
        <span ref={(section) => {
          this.FeatureRequest = section;
        }}
        />
        <FeatureRequest />
        <Testimonials />
        <Purchase />
        <Footer />
      </div>
    );
  }
}

export default connect(state => ({ theme: state.theme }))(Landing);
