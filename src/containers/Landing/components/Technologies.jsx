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
          <h3 className="landing__section-title">The EasyDev based on popular and powerful technological stack.
                That’s why it allows you to create massive and serious projects easily.
          </h3>
        </Col>
      </Row>
      <Row className="landing__code">
        <Col md={6} sm={12} xs={12}>
          <div className="landing__code-text">
            <div className="landing__code-wrap">
              <h3 className="landing__section-title">Fully Responsive</h3>
              <p>{'You can use the Easydev on all devices - it\'ll look great everywhere!'}</p>
              <p>Lazy loading allows your device to display the graphic content softly and correctly</p>
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
              <h3 className="landing__section-title">Clean and Professional Code</h3>
              <p>We have created a quality product that will be convenient for developers to use. The main advantage
                    is a clean, correct and easy to understand code.
              </p>
              <p>React framework allows you to create a component architecture, get the best productivity and
                    render changes automatically.
              </p>
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
