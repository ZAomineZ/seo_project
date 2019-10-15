/* eslint-disable */
import React, {PureComponent} from 'react';
import { Progress } from 'reactstrap';
import PropTypes from 'prop-types';
import Panel from '../../shared/components/Panel';
import ChartsStats from "./ChartsStats";

class KeywordPanel extends PureComponent
{
    constructor() {
        super();
    }

    static propTypes = {
      title: PropTypes.string.isRequired,
      charts: PropTypes.bool.isRequired,
      Top3TitleCharts: PropTypes.string,
      Top10TitleCharts: PropTypes.string,
      Top25TitleCharts: PropTypes.string,
      Top50TitleCharts: PropTypes.string,
      Top100TitleCharts: PropTypes.string
    };

    render() {
        return (
            <Panel title={this.props.title} subhead="List of correlation data">
                {
                    this.props.charts ?
                        <div className={'row'}>
                            <div className='col-md-6 col-xs-6'>
                                <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                    <p>{ this.props.Top3TitleCharts }</p>
                                    <Progress value={46}>46%</Progress>
                                </div>
                                <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                    <p>{ this.props.Top10TitleCharts }</p>
                                    <Progress value={67}>67%</Progress>
                                </div>
                                <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                    <p>{ this.props.Top25TitleCharts }</p>
                                    <Progress value={87}>87%</Progress>
                                </div>
                                <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                    <p>{ this.props.Top50TitleCharts }</p>
                                    <Progress value={24}>24%</Progress>
                                </div>
                                <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                    <p>{ this.props.Top100TitleCharts }</p>
                                    <Progress value={56}>56%</Progress>
                                </div>
                            </div>
                            <div className='col-md-6 col-xs-6'>
                                <ChartsStats />
                            </div>
                        </div>
                        :
                        <div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Referring IP</p>
                                <Progress value={46}>46%</Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Score Rank</p>
                                <Progress value={67}>67%</Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Trust Rank</p>
                                <Progress value={87}>87%</Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Ratio</p>
                                <Progress value={24}>24%</Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Traffic</p>
                                <Progress value={56}>56%</Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>In Https</p>
                                <Progress value={46}>46%</Progress>
                            </div>
                            <div className="progress-wrap progress-wrap--small progress-wrap--blue">
                                <p>Keyword in Title</p>
                                <Progress value={31}>31%</Progress>
                            </div>
                        </div>
                }
            </Panel>
        )
    }
}

export default KeywordPanel
