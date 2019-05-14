/* eslint-disable */
import React, {PureComponent} from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
import { CardBody } from 'reactstrap';
import MapMarkerRadiusIcon from 'mdi-react/MapMarkerRadiusIcon';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

class Distance extends PureComponent {
    static propTypes = {
        referring_domain: PropTypes.number.isRequired,
        backlink: PropTypes.number.isRequired,
        domain: PropTypes.number.isRequired,
    };

    constructor (props) {
        super(props);
    }

    DiffResult(number)
    {
        return this.props.backlink - number
    }

    render() {
        const data = [{ value: this.props.domain, fill: '#70bbfd' }, { value: this.DiffResult(this.props.domain), fill: '#eeeeee' }];
        return (
            <CardBody className="dashboard__health-chart-card">
                <div className="card__title">
                    <h5 className="bold-text">Referring Domain</h5>
                </div>
                <div className="dashboard__health-chart">
                    <ResponsiveContainer height={180}>
                        <PieChart>
                            <Pie data={data} dataKey="value" cy={85} innerRadius={80} outerRadius={90} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="dashboard__health-chart-info">
                        <p className="dashboard__health-chart-number">{ this.props.referring_domain }</p>
                        <p className="dashboard__health-chart-units">{ this.props.domain } / { this.props.backlink }</p>
                    </div>
                </div>
                <p className="dashboard__goal">Referring: { this.props.referring_domain }</p>
            </CardBody>
        );
    }
}

export default translate('common')(Distance);
