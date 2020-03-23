/* eslint-disable */
import StatsRank from "./StatsRank";
import React, {PureComponent} from "react";
import * as PropTypes from "prop-types";
import moment from "moment";

export default class StatsRankChart extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        id: PropTypes.string.isRequired,
        dataResultRank: PropTypes.array.isRequired
    };

    formatData(dataFormat, valueTop) {
        let dataR = Object.values(this.props.dataResultRank);
        let data = dataR.map((d) => {
            let dataArray = Object.values(d);
            return dataArray.map((value) => {
                const date = new Date(value.dateUsort);

                return {
                    name: moment(date).format(dataFormat === 1 ? 'MM.D' : 'MMM'),
                    value: valueTop === 'top1' ? value.top1 === undefined ? 0 : value.top1 :
                        valueTop === 'top3' ? value.top3 === undefined ? 0 : value.top3 :
                            valueTop === 'top10' ? value.top10 === undefined ? 0 : value.top10 :
                                valueTop === 'top50' ? value.top50 === undefined ? 0 : value.top50 :
                                    valueTop === 'top100' ? value.top100 === undefined ? 0 : value.top100 : ''
                }
            })
        });
        return data[dataFormat]
    }

    render() {
        if (this.formatData(0, 'top100').length !== 0 && this.formatData(1, 'top100').length !== 0) {
            return (
                <div className="project-summary__stats">
                    <div className="project-summary__stat col-md-2">
                        <p>Chart <span>Top 100</span></p>
                        <StatsRank name={'sales_1_' + this.props.id}
                                   monthStats={this.formatData(1, 'top100')}
                                   yearsStats={this.formatData(0, 'top100')} />
                    </div>
                    <div className="project-summary__stat col-md-2">
                        <p>Chart <span>Top 50</span></p>
                        <StatsRank name={'sales_2_' + this.props.id}
                                   monthStats={this.formatData(1, 'top50')}
                                   yearsStats={this.formatData(0, 'top50')}/>
                    </div>
                    <div className="project-summary__stat col-md-2">
                        <p>Chart <span>Top 10</span></p>
                        <StatsRank name={'sales_3_' + this.props.id}
                                   monthStats={this.formatData(1, 'top10')}
                                   yearsStats={this.formatData(0, 'top10')}/>
                    </div>
                    <div className="project-summary__stat col-md-2">
                        <p>Chart <span>Top 3</span></p>
                        <StatsRank name={'sales_4_' + this.props.id}
                                   monthStats={this.formatData(1, 'top3')}
                                   yearsStats={this.formatData(0, 'top3')}/>
                    </div>
                    <div className="project-summary__stat col-md-2">
                        <p>Chart <span>Top 1</span></p>
                        <StatsRank name={'sales_5_' + this.props.id}
                                   monthStats={this.formatData(1, 'top1')}
                                   yearsStats={this.formatData(0, 'top1')}/>
                    </div>
                </div>
            );
        } else {
            return '';
        }
    }
}
