/* eslint-disable */

import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import { Link } from 'react-router-dom';

const background = `${process.env.PUBLIC_URL}/img/landing/header_bg.png`;
const img = `${process.env.PUBLIC_URL}/img/landing/landing_1.png`;

const Header = () => (
  <div className="landing__header" style={{ backgroundImage: `url(${background})` }}>
    <Container>
      <Row>
        <Col md={12}>
          <h2 className="landing__header-title">The free App for checking your SEO <br/>
            <b> 8 Tools </b> created with <br /> <b>React + Laravel !</b>
          </h2>
          <p className="landing__header-subhead">We created this application to have free support to analyze a site quickly and easily.
          </p>
          <Link className="landing__btn landing__btn--header" to="/log_in">
            Sign In
          </Link>
          <Link className="landing__btn landing__btn--header" to="/register">
            Register
          </Link>
          <img className="landing__header-img" src={img} alt="macbook" />
        </Col>
      </Row>
    </Container>
  </div>
);

export default Header;
