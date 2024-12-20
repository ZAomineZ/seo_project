/* eslint-disable */
import React from 'react';
import { Col, Row, Container } from 'reactstrap';

const background = `${process.env.PUBLIC_URL}/img/landing/bottom_bg.png`;

const Footer = () => (
  <footer className="landing__footer">
    <img className="landing__footer-background" src={background} alt="" />
    <Container>
      <Row>
        <Col md={12}>
          <p className="landing__footer-text">Made with love with React -
            <a href="/legal"> Legal</a>
          </p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
