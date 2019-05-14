/* eslint-disable */
import React, {PureComponent} from 'react';
import { PieChart, Pie } from 'recharts';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import ModalStats from './crawl_modal_stats';

class CrawlStats extends PureComponent{
    static propTypes = {
      dup_title: PropTypes.array.isRequired,
      dup_meta: PropTypes.array.isRequired,
      dup_h1: PropTypes.array.isRequired,
      data: PropTypes.array.isRequired
    };

    constructor () {
        super()
    }

    render() {
        const dup_title = Object.values(this.props.dup_title);
        const dup_meta = Object.values(this.props.dup_meta);
        const dup_h1 = Object.values(this.props.dup_h1);

        const data01 = [{ value: (dup_title.length / this.props.data.length) * 100, fill: '#4ce1b6' },
            { value: Math.abs((dup_title.length / this.props.data.length) * 100 - 100), fill: '#eeeeee' }];

        const data02 = [{ value: (dup_meta.length / this.props.data.length) * 100, fill: '#4ce1b6' },
            { value: Math.abs((dup_meta.length / this.props.data.length) * 100 - 100), fill: '#eeeeee' }];

        const data03 = [{ value: (dup_h1.length / this.props.data.length) * 100, fill: '#4ce1b6' },
            { value: Math.abs((dup_h1.length / this.props.data.length) * 100 - 100), fill: '#eeeeee' }];

        const num_title = (dup_title.length / this.props.data.length) * 100;
        const num_meta = (dup_meta.length / this.props.data.length) * 100;
        const num_h1 = (dup_h1.length / this.props.data.length) * 100;

        return (
            <div>
                <div className="dashboard__stat item_center_stat">
                    <div className="dashboard__stat-chart pl-5">
                        <PieChart height={120} width={120}>
                            <Pie data={data01} dataKey="value" cx={55} cy={55} innerRadius={55} outerRadius={60} />
                        </PieChart>
                        <p className="dashboard__stat-label" style={{ color: '#4ce1b6' }}> { num_title.toFixed(2) }%</p>
                    </div>
                    <div className="dashboard__stat-info">
                        <p>Duplicate Title</p>
                        <h4 className="dashboard__-stat-number">
                            { dup_title.length }
                        </h4>
                        <ModalStats
                            color="primary"
                            title="Title Duplicate"
                            btn="More"
                            data={dup_title}
                        />
                    </div>
                    <div className="dashboard__stat-chart pl-5">
                        <PieChart width={120} height={120}>
                            <Pie data={data02} dataKey="value" cx={55} cy={55} innerRadius={55} outerRadius={60} />
                        </PieChart>
                        <p className="dashboard__stat-label" style={{ color: '#4ce1b6' }}> { num_meta.toFixed(2) }%</p>
                    </div>
                    <div className="dashboard__stat-info">
                        <p>Duplicate Meta Description</p>
                        <h4 className="dashboard__stat-number">
                            { dup_meta.length }
                        </h4>
                        <ModalStats
                            color="primary"
                            title="Meta Description Duplicate"
                            btn="More"
                            data={dup_meta}
                        />
                    </div>
                    <div className="dashboard__stat-chart pl-5">
                        <PieChart width={120} height={120}>
                            <Pie data={data03} dataKey="value" cx={55} cy={55} innerRadius={55} outerRadius={60} />
                        </PieChart>
                        <p className="dashboard__stat-label" style={{ color: '#4ce1b6' }}> { num_h1.toFixed(2) }%</p>
                    </div>
                    <div className="dashboard__stat-info">
                        <p>Duplicate H1</p>
                        <h4 className="dashboard__stat-number">
                            { dup_h1.length }
                        </h4>
                        <ModalStats
                            color="primary"
                            title="H1 Duplicate"
                            btn="More"
                            data={dup_h1}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
export default translate('common')(CrawlStats);
