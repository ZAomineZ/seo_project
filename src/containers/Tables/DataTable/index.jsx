import React from 'react';
import { Container, Row } from 'reactstrap';
import { translate } from 'react-i18next';
import Table from './components/DataTable';

const DataTable = () => (
  <Container>
    <Row>
      <Table />
    </Row>
  </Container>
);

export default translate('common')(DataTable);
