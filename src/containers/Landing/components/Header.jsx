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
          <h2 className="landing__header-title">The best documented and cleanest coded
            <b> React Bootstrap 4</b> Admin Template <br />+ <b>Seed Project</b> Inside!
          </h2>
          <p className="landing__header-subhead">We guarantee you will always get the actual version of the template
            with a bunch of{' '}
            <Link className="landing__header-subhead-update" to="/documentation/changelog" target="_blank">
              freshest updates
            </Link>.
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
