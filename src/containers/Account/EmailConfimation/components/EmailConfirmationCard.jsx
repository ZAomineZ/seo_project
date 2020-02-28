import React from 'react';
import { Card, CardBody, Col, ButtonToolbar } from 'reactstrap';
import EmailIcon from 'mdi-react/EmailIcon';
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon';
import { Link } from 'react-router-dom';

const EmailConfirmationCard = () => (
  <Col md={12}>
    <Card>
      <CardBody>
        <div className="email-confirmation">
          <div className="email-confirmation__icon">
            <EmailIcon className="email-confirmation__mail" />
            <CheckboxMarkedCircleIcon className="email-confirmation__check" />
          </div>
          <h3 className="email-confirmation__title">A mail has been enjoyed to your e-mail address</h3>
          <p className="email-confirmation__sub">Thank you for choosing the MachinOols</p>
          <ButtonToolbar className="email-confirmation__buttons">
            <Link className="btn btn-primary" to="/">Go to Home</Link>
          </ButtonToolbar>
        </div>
      </CardBody>
    </Card>
  </Col>
);


export default EmailConfirmationCard;
