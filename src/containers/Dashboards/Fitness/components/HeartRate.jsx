/* eslint-disable */
import React, {PureComponent} from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
import { CardBody } from 'reactstrap';
import HeartOutlineIcon from 'mdi-react/HeartOutlineIcon';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

class HeartRate extends PureComponent {
    static propTypes = {
        trust_rank: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props)
    }

    DiffResult (number)
    {
        return 100 - number
    }

    render() {
        const data = [{ value: this.props.trust_rank, fill: '#ff4861' }, { value: this.DiffResult(this.props.trust_rank), fill: '#eeeeee' }];
        return (
            <CardBody className="dashboard__health-chart-card">
                <div className="card__title">
                    <h5 className="bold-text">Trust Rank</h5>
                </div>
                <div className="dashboard__health-chart">
                    <ResponsiveContainer height={180}>
                        <PieChart>
                            <Pie data={data} dataKey="value" cy={85} innerRadius={80} outerRadius={90} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="dashboard__health-chart-info">
                        <p className="dashboard__health-chart-number">{ this.props.trust_rank }</p>
                        <p className="dashboard__health-chart-units">{ this.props.trust_rank } /100</p>
                    </div>
                </div>
                <p className="dashboard__goal">Percentage: 0-100</p>
            </CardBody>
        );
    }
}

export default translate('common')(HeartRate);
