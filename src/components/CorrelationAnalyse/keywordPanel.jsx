/* eslint-disable */
import React, {PureComponent} from 'react';
import {Progress} from 'reactstrap';
import PropTypes from 'prop-types';
import Panel from '../../shared/components/Panel';
import ChartsStats from "./ChartsStats";

class KeywordPanel extends PureComponent {
    constructor() {
        super();
    }

    static propTypes = {
        title: PropTypes.string.isRequired,
        charts: PropTypes.bool.isRequired,
        description: PropTypes.string,

        Top3TitleCharts: PropTypes.string,
        Top5TitleCharts: PropTypes.string,
        Top10TitleCharts: PropTypes.string,

        top3Stats: PropTypes.float,
        top5Stats: PropTypes.float,
        top10Stats: PropTypes.float,

        ipStats: PropTypes.float,
        rankScoreStats: PropTypes.float,
        trustScoreStats: PropTypes.float,
        ratioStats: PropTypes.float,
        trafficStats: PropTypes.float,
        httpsStats: PropTypes.float,
        titleStats: PropTypes.float,

        data: PropTypes.array
    };

    render() {
        return (
            <Panel title={this.props.title}
                   subhead={
                       this.props.description ?
                           'List of correlation data' + this.props.description
                           :
                           'List of correlation data'
                   }>
                {
                    this.props.charts ?
                        <div className={'row'}>
                            <div className='col-md-6 col-xs-6 pt-2'>
                                <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                    <p>{this.props.Top3TitleCharts}</p>
                                    <Progress value={Math.round(this.props.top3Stats)}>
                                        {
                                            Math.round(this.props.top3Stats) + '%'
                                        }
                                    </Progress>
                                </div>
                                <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                    <p>{this.props.Top5TitleCharts}</p>
                                    <Progress value={Math.round(this.props.top5Stats)}>
                                        {
                                            Math.round(this.props.top5Stats) + '%'
                                        }
                                    </Progress>
                                </div>
                                <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                    <p>{this.props.Top10TitleCharts}</p>
                                    <Progress value={Math.round(this.props.top10Stats)}>
                                        {
                                            Math.round(this.props.top10Stats) + '%'
                                        }
                                    </Progress>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-6'>
                                <ChartsStats data={this.props.data}/>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Referring IP</p>
                                <Progress value={Math.round(this.props.ipStats)}>
                                    {
                                        Math.round(this.props.ipStats) + '%'
                                    }
                                </Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Score Rank</p>
                                <Progress value={Math.round(this.props.rankScoreStats)}>
                                    {
                                        Math.round(this.props.rankScoreStats) + '%'
                                    }
                                </Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Trust Rank</p>
                                <Progress value={Math.round(this.props.trustScoreStats)}>
                                    {
                                        Math.round(this.props.trustScoreStats) + '%'
                                    }
                                </Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Ratio</p>
                                <Progress value={Math.round(this.props.ratioStats)}>
                                    {
                                        Math.round(this.props.ratioStats) + '%'
                                    }
                                </Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Traffic</p>
                                <Progress value={Math.round(this.props.trafficStats)}>
                                    {
                                        Math.round(this.props.trafficStats) + '%'
                                    }
                                </Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>In Https</p>
                                <Progress value={Math.round(this.props.httpsStats)}>
                                    {
                                        Math.round(this.props.httpsStats) + '%'
                                    }
                                </Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Keyword in Title</p>
                                <Progress value={Math.round(this.props.titleStats)}>
                                    {
                                        Math.round(this.props.titleStats) + '%'
                                    }
                                </Progress>
                            </div>
                        </div>
                }
            </Panel>
        )
    }
}

export default KeywordPanel
