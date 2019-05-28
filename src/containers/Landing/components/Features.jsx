import React from 'react';
import { Col, Row, Container } from 'reactstrap';
import CheckIcon from 'mdi-react/CheckIcon';

const Features = () => (
  <section className="landing__section">
    <Container>
      <Row>
        <Col md={12}>
          <h3 className="landing__section-title">Key features</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="landing__features-wrap landing__features-wrap--more">
            <p className="landing__feature-more"><CheckIcon /> Google Serp Analysis</p>
            <p className="landing__feature-more"><CheckIcon /> Top 10 Chart Serp</p>
            <p className="landing__feature-more"><CheckIcon /> Top Lose Google Serp</p>
            <p className="landing__feature-more"><CheckIcon /> WebSite Analysis</p>
            <p className="landing__feature-more"><CheckIcon /> Metrics Rank</p>
            <p className="landing__feature-more"><CheckIcon /> Seo Traffic Chart</p>
            <p className="landing__feature-more"><CheckIcon /> Backlink Profile</p>
            <p className="landing__feature-more"><CheckIcon /> Campaign Backlinks</p>
            <p className="landing__feature-more"><CheckIcon /> Other Tools</p>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
);

export default Features;
