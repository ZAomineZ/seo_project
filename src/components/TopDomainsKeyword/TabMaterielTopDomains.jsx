/* eslint-disable */
import React, {PureComponent} from 'react';
import { Container, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import MatTableTopDomains from '../TopDomainsKeyword/MatTableTopDomains';

class TabMaterielTopDomains extends PureComponent{
    static propTypes = {
      data: PropTypes.oneOfType([
          PropTypes.array,
          PropTypes.object
      ]).isRequired,
      keyword: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Row>
                    <MatTableTopDomains data={this.props.data} keyword={this.props.keyword}/>
                </Row>
            </Container>
        );
    }
}

export default TabMaterielTopDomains;
