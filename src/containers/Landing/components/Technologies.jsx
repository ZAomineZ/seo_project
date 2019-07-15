/* eslint-disable */
import React from 'react';
import { Col, Container, Row } from 'reactstrap';

const serp = `${process.env.PUBLIC_URL}/img/landing/serp.png`;
const webSite = `${process.env.PUBLIC_URL}/img/landing/landing_website.png`;
const background = `${process.env.PUBLIC_URL}/img/landing/right_bg.png`;

const Technologies = () => (
  <section className="landing__section">
    <img className="landing__section-background landing__section-background--technologies" src={background} alt="" />
    <Container>
      <Row>
        <Col md={12}>
          <h3 className="landing__section-title">The app proposes to give some metrics to rate each site with an estimated traffic curve and many other data.</h3>
        </Col>
      </Row>
      <Row className="landing__code">
        <Col md={6} sm={12} xs={12}>
          <div className="landing__code-text">
            <div className="landing__code-wrap">
              <h3 className="landing__section-title">Anchors + Backlinks</h3>
              <p>{'You can see the anchors and the percentage of their use for each site'}</p>
              <p>There is also the possibility to follow the advanced referrings and backlinks in time.</p>
            </div>
          </div>
        </Col>
        <Col md={6} sm={12} xs={12}>
          <div className="landing__code-img">
            <div className="landing__code-wrap">
              <img className="landing__img landing__img--over" src={webSite} alt="" />
            </div>
          </div>
        </Col>
      </Row>
      <Row className="landing__code">
        <Col md={6} sm={12} xs={12}>
          <div className="landing__code-text">
            <div className="landing__code-wrap">
              <h3 className="landing__section-title">Serp analysis (Google)</h3>
              <p>We created a system that retrieves the serp with the info for each site and a follow-up with a visualization.</p>
              <p>There is the possibility to see some metrics for each site.</p>
            </div>
          </div>
        </Col>
        <Col md={6} sm={12} xs={12}>
          <div className="landing__code-img">
            <div className="landing__code-wrap">
              <img className="landing__img landing__img--over-right" src={serp} alt="" />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

export default Technologies;
