import React from 'react';
import { Container, Row } from 'reactstrap';
import OrdersListTable from './components/OrdersListTable';

const OrdersList = () => (
  <Container>
    <Row>
      <OrdersListTable />
    </Row>
  </Container>
);

export default OrdersList;
