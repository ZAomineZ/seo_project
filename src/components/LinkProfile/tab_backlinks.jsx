/* eslint-disable */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import DynamiclyRefreshedDoughnut from '../../containers/Charts/ChartJs/components/DynamiclyRefreshedDoughnut';
import RandomAnimatedBars from '../../containers/Charts/ChartJs/components/RandomAnimatedBars';

export default class PanelBacklinks extends PureComponent {
    static propTypes = {
        data: PropTypes.array.isRequired,
        data_page: PropTypes.array.isRequired,
        referring_data: PropTypes.array,
        anchor_data: PropTypes.array.isRequired,
        anchor_label: PropTypes.array.isRequired,
        follow: PropTypes.number.isRequired,
        nofollow: PropTypes.number.isRequired,
        image: PropTypes.number.isRequired,
        text: PropTypes.number.isRequired,
    };

    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        Top Backlink
                    </div>
                    <div className="card_style card-body">
                        <table className="table--bordered table">
                            <thead>
                            <tr>
                                <th>Number</th>
                                <th>Url</th>
                                <th>Label Name</th>
                                <th>Keyword</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.props.data.map(d => (
                                    <tr>
                                        <td>
                                            <span className="badge badge-primary">{ d.page_trust_score }</span>
                                        </td>
                                        <td>
                                            <a href={d.source_url} target='_blank'>{ d.source_url }</a>
                                        </td>
                                        <td><span className={d.nofollow === false ? 'badge badge-success' : 'badge badge-danger' }>
                                            { d.nofollow === false ? 'Follow' : 'NoFollow' }
                                            </span></td>
                                        <td><span className="span_primary_tab badge badge-primary">{ d.anchor }</span></td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        Top Pages
                    </div>
                    <div className="card_style card-body">
                        <table className="table--bordered table">
                            <thead>
                            <tr>
                                <th>Url</th>
                                <th>Number</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                              this.props.data_page.map(data => (
                                  <tr>
                                      <td>
                                          <a href={data.source_url} target='_blank'>{ data.source_url }</a>
                                      </td>
                                      <td><span className="span_primary_tab badge badge-primary">{ data.backlinks_num }</span></td>
                                  </tr>
                              ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        Backlink Type
                    </div>
                    <div className="card_style card-body">
                        <div className="row chart_pt">
                            <div className="col-md-12 col-lg-12 col-xl-6">
                                <DynamiclyRefreshedDoughnut labels={["NoFollow", "Follow"]}
                                                            numb_item_first={this.props.nofollow}
                                                            numb_item_second={this.props.follow} />
                            </div>
                            <div className="col-md-12 col-lg-12 col-xl-6">
                                <DynamiclyRefreshedDoughnut labels={["Image", "Text"]}
                                                            numb_item_first={this.props.image}
                                                            numb_item_second={this.props.text} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        Overview anchor
                    </div>
                    <div className="card_style card-body">
                        <div className="row chart_pt">
                            <RandomAnimatedBars anchor_data={this.props.anchor_data} anchor_label={this.props.anchor_label} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

