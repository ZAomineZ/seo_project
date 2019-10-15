/* eslint-disable */
import React, {PureComponent} from "react";
import {Container, Col, Row} from "reactstrap";
import KeywordPanel from './keywordPanel'
import KeywordStatsChart from './KeywordStatsChart'

export default class showCorrelation extends PureComponent
{
    componentDidMount() {
        console.log('lol');
    }

    render() {
        return (
            <Container className='dashboard'>
                <Row>
                    <Col md={12}>
                        <h3 className="page-title">Correlation Analyse: { this.props.match.params.keyword }</h3>
                    </Col>
                </Row>
                <Row>
                    <div className="col-md-4 col-xs-4">
                        <KeywordPanel title={'Top 3 Correlation'} charts={false}/>
                    </div>
                    <div className="col-md-4 col-xs-4">
                        <KeywordPanel title={'Top 10 Correlation'} charts={false}/>
                    </div>
                    <div className="col-md-4 col-xs-4">
                        <KeywordPanel title={'Top 100 Correlation'} charts={false}/>
                    </div>
                </Row>
                <Row>
                    <KeywordStatsChart
                        title={'Referring Ip Analyse'}
                        Top3TitleCharts={'Top 3 Referring IP (800)'}
                        Top10TitleCharts={'Top 10 Referring IP (800)'}
                        Top25TitleCharts={'Top 25 Referring IP (800)'}
                        Top50TitleCharts={'Top 50 Referring IP (800)'}
                        Top100TitleCharts={'Top 100 Referring IP (800)'}
                    />
                    <KeywordStatsChart
                        title={'Score Rank Analyse'}
                        Top3TitleCharts={'Top 3 Score Rank (800)'}
                        Top10TitleCharts={'Top 10 Score Rank (800)'}
                        Top25TitleCharts={'Top 25 Score Rank (800)'}
                        Top50TitleCharts={'Top 50 Score Rank (800)'}
                        Top100TitleCharts={'Top 100 Score Rank (800)'}
                    />
                    <KeywordStatsChart
                        title={'Trust Rank Analyse'}
                        Top3TitleCharts={'Top 3 Trust Rank (800)'}
                        Top10TitleCharts={'Top 10 Trust Rank (800)'}
                        Top25TitleCharts={'Top 25 Trust Rank (800)'}
                        Top50TitleCharts={'Top 50 Trust Rank (800)'}
                        Top100TitleCharts={'Top 100 Trust Rank (800)'}
                    />
                    <KeywordStatsChart
                        title={'Ratio Analyse'}
                        Top3TitleCharts={'Top 3 Ratio (800)'}
                        Top10TitleCharts={'Top 10 Ratio (800)'}
                        Top25TitleCharts={'Top 25 Ratio (800)'}
                        Top50TitleCharts={'Top 50 Ratio (800)'}
                        Top100TitleCharts={'Top 100 Ratio (800)'}
                    />
                    <KeywordStatsChart
                        title={'Traffic Analyse'}
                        Top3TitleCharts={'Top 3 Traffic (800)'}
                        Top10TitleCharts={'Top 10 Traffic (800)'}
                        Top25TitleCharts={'Top 25 Traffic (800)'}
                        Top50TitleCharts={'Top 50 Traffic (800)'}
                        Top100TitleCharts={'Top 100 Traffic (800)'}
                    />
                    <KeywordStatsChart
                        title={'Https Analyse'}
                        Top3TitleCharts={'Top 3 Https'}
                        Top10TitleCharts={'Top 10 Https'}
                        Top25TitleCharts={'Top 25 Https'}
                        Top50TitleCharts={'Top 50 Https'}
                        Top100TitleCharts={'Top 100 Https'}
                    />
                    <KeywordStatsChart
                        title={'Title Analyse'}
                        Top3TitleCharts={'Top 3 Title'}
                        Top10TitleCharts={'Top 10 Title'}
                        Top25TitleCharts={'Top 25 Title'}
                        Top50TitleCharts={'Top 50 Title'}
                        Top100TitleCharts={'Top 100 Title'}
                    />
                </Row>
            </Container>
        );
    }
}
