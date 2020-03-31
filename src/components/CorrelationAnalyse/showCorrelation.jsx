/* eslint-disable */
import React, {PureComponent} from "react";
import {Container, Col, Row} from "reactstrap";
import KeywordStatsChart from './KeywordStatsChart'
import axios from "axios";
import {route, requestUri} from "../../const";
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import {Redirect} from "react-router-dom";
import TabPanelData from "./Component/TabPanelData";
import Cookie from "../../js/Cookie";
import NotificationMessage from "../../js/NotificationMessage";

let notification = null;

const showNotification = (error, message) => {
    notification.notice({
        content: <BasicNotification
            color="danger"
            title={error}
            message={message ? message : "This Url is invalid !!!"}
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

export default class showCorrelation extends PureComponent {

    constructor() {
        super();
        console.error = () => {
        };
        console.error();
        this.state = {
            redirectIndex: false,
            redirectSerp: false,

            loading: true,
            loaded: false,

            dataTop3: [],
            dataTop5: [],
            dataTop10: [],
            listOfWebsites: [],

            maxStatsIp: 0,
            maxStatsRankScore: 0,
            maxStatsTrustScore: 0,
            maxStatsRatio: 0,
            maxStatsTraffic: 0,
            maxStatsAnchors: 0,

            dataIpStats: [],
            dataRankScoreStats: [],
            dataTrustScoreStats: [],
            dataRatioStats: [],
            dataTrafficStats: [],
            dataAnchorStats: [],
            dataHttpsStats: [],
            dataTitleStats: []
        };
        this.dataWithWebsites = this.dataWithWebsites.bind(this);
    }

    /**
     * Reset Cookie User When Invalid Token found in the Request Ajax with Axios
     * @param token
     * @param id
     * @constructor
     */
    CookieReset(token, id) {
        Cookie.CookieReset(token, id);
        this.setState({redirectSerp: !this.state.redirectSerp})
    }

    componentDidMount() {
        if (sessionStorage.getItem('Auth')) {
            let keyword = this.props.match.params.keyword;

            if (keyword && keyword !== '') {
                const headers = {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                    'Access-Control-Max-Age': 1728000,
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
                };

                const params = {
                    keyword: keyword,
                    cookie: Cookie.getCookie('remember_me_auth') ?
                        Cookie.getCookie('remember_me_auth') :
                        Cookie.getCookie('auth_today'),
                    auth: sessionStorage.getItem('Auth') ?
                        sessionStorage.getItem('Auth')
                        : ''
                };

                axios.get(requestUri + window.location.hostname + route + '/Ajax/Correlation/CorrelationData.php', {
                    headers: headers,
                    params: params,
                }).then((response) => {
                    return this.responseDataWebsites(response)
                })
            }
        } else {
            this.setState({redirectSerp: !this.state.redirectSerp});
        }
    }

    dataWithWebsites(data) {
        this.setState({
            loading: true,
            loaded: false,
        });

        let keyword = this.props.match.params.keyword;

        let formData = new FormData();

        formData.set('websiteData', JSON.stringify(data));
        formData.set('keyword', keyword);
        formData.set('cookie', Cookie.getCookie('remember_me_auth') ? Cookie.getCookie('remember_me_auth') : Cookie.getCookie('auth_today'));
        formData.set('auth', sessionStorage.getItem('Auth') ? sessionStorage.getItem('Auth') : '');

        const header = {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, HEAD',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
            'Access-Control-Max-Age': 1728000,
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        };

        axios.post(requestUri + window.location.hostname + route + '/Ajax/Correlation/CorrelationDataWithWebsites.php', formData, {
            headers: header
        }).then((response) => {
            return this.responseDataWebsites(response)
        })
    }

    responseDataWebsites(response) {
        if (response && response.status === 200) {
            if (response.data.error) {
                if (response.data.error === 'Invalid Token') {
                    this.CookieReset(response.data.token, response.data.id);
                } else {
                    this.setState({redirectIndex: !this.state.redirectIndex});
                    return NotificationMessage.notification(response.data.error, '👋 Warning !!!', 'danger');
                }
            } else {
                let dataAverage = response.data.dataTopAverage;
                let dataWebsite = response.data.dataWebsiteStats;
                let listOfWebsites = Object.values(response.data.listsOfWebsites);

                const dataTop3 = [
                    {
                        ipStatsTop: dataAverage.referring_ip.top3.average,
                        rankScoreStatsTop: dataAverage.score_rank.top3.average,
                        trustScoreStatsTop: dataAverage.trust_rank.top3.average,
                        ratioStatsTop: dataAverage.ratio.top3.average,
                        trafficStatsTop: dataAverage.traffic.top3.average,
                        blInfoTop: dataAverage.blInfo.top3.average,
                        httpsStatsTop: dataAverage.https.top3.average,
                        titleStatsTop: dataAverage.title.top3.average
                    },
                ];

                const dataTop5 = [
                    {
                        ipStatsTop: dataAverage.referring_ip.top5.average,
                        rankScoreStatsTop: dataAverage.score_rank.top5.average,
                        trustScoreStatsTop: dataAverage.trust_rank.top5.average,
                        ratioStatsTop: dataAverage.ratio.top5.average,
                        trafficStatsTop: dataAverage.traffic.top5.average,
                        blInfoTop: dataAverage.blInfo.top5.average,
                        httpsStatsTop: dataAverage.https.top5.average,
                        titleStatsTop: dataAverage.title.top5.average
                    }
                ];

                const dataTop10 = [
                    {
                        ipStatsTop: dataAverage.referring_ip.top10.average,
                        rankScoreStatsTop: dataAverage.score_rank.top10.average,
                        trustScoreStatsTop: dataAverage.trust_rank.top10.average,
                        ratioStatsTop: dataAverage.ratio.top10.average,
                        trafficStatsTop: dataAverage.traffic.top10.average,
                        blInfoTop: dataAverage.blInfo.top10.average,
                        httpsStatsTop: dataAverage.https.top10.average,
                        titleStatsTop: dataAverage.title.top10.average
                    }
                ];

                this.setState({
                    dataTop3: dataTop3,
                    dataTop5: dataTop5,
                    dataTop10: dataTop10,
                    listOfWebsites: listOfWebsites,

                    maxStatsIp: dataAverage.referring_ip.maxValue,
                    maxStatsRankScore: dataAverage.score_rank.maxValue,
                    maxStatsTrustScore: dataAverage.trust_rank.maxValue,
                    maxStatsRatio: dataAverage.ratio.maxValue,
                    maxStatsTraffic: dataAverage.traffic.maxValue,
                    maxStatsAnchors: dataAverage.blInfo.maxValue
                });
                this.setState({
                    dataIpStats: Object.values(dataWebsite.referring_ip),
                    dataRankScoreStats: Object.values(dataWebsite.score_rank),
                    dataTrustScoreStats: Object.values(dataWebsite.trust_rank),
                    dataRatioStats: Object.values(dataWebsite.ratio),
                    dataTrafficStats: Object.values(dataWebsite.traffic),
                    dataAnchorStats: Object.values(dataWebsite.blInfo),
                    dataHttpsStats: Object.values(dataWebsite.https),
                    dataTitleStats: Object.values(dataWebsite.title)
                });
                this.setState({loading: !this.state.loading});
                setTimeout(() => this.setState({loaded: true}), 500);
            }
        }
    }

    render() {
        if (this.state.redirectIndex) {
            return (
                <Redirect to={{
                    pathname: '/seo/correlationData'
                }}/>
            )
        } else if (this.state.redirectSerp) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp'
                }}/>
            )
        }

        return (
            <Container className='dashboard'>
                {!this.state.loaded &&
                <div className={`load${this.state.loading ? '' : ' loaded'}`}>
                    <div className="load__icon-wrap">
                        <svg className="load__icon">
                            <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                        </svg>
                    </div>
                </div>
                }
                <Row>
                    <Col md={12}>
                        <h3 className="page-title">Correlation Analyse: {this.props.match.params.keyword}</h3>
                    </Col>
                </Row>
                <TabPanelData dataTop3={this.state.dataTop3[0] ? this.state.dataTop3[0] : {}}
                              dataTop5={this.state.dataTop5[0] ? this.state.dataTop5[0] : {}}
                              dataTop10={this.state.dataTop10[0] ? this.state.dataTop10[0] : {}}
                              methodNewData={this.dataWithWebsites}
                              dataWebsites={this.state.listOfWebsites}/>
                <Row>
                    <KeywordStatsChart
                        title={'Referring Ip Analyse'}
                        description={' (Max Referring Ip)'}
                        top3Stats={this.state.dataTop3[0] ? this.state.dataTop3[0].ipStatsTop : 0}
                        top5Stats={this.state.dataTop5[0] ? this.state.dataTop5[0].ipStatsTop : 0}
                        top10Stats={this.state.dataTop10[0] ? this.state.dataTop10[0].ipStatsTop : 0}
                        Top3TitleCharts={'Top 3 Referring IP (' + this.state.maxStatsIp + ')'}
                        Top5TitleCharts={'Top 5 Referring IP (' + this.state.maxStatsIp + ')'}
                        Top10TitleCharts={'Top 10 Referring IP (' + this.state.maxStatsIp + ')'}
                        data={this.state.dataIpStats}
                    />
                    <KeywordStatsChart
                        title={'Score Rank Analyse'}
                        description={' (Max Score Rank)'}
                        top3Stats={this.state.dataTop3[0] ? this.state.dataTop3[0].rankScoreStatsTop : 0}
                        top5Stats={this.state.dataTop5[0] ? this.state.dataTop5[0].rankScoreStatsTop : 0}
                        top10Stats={this.state.dataTop10[0] ? this.state.dataTop10[0].rankScoreStatsTop : 0}
                        Top3TitleCharts={'Top 3 Score Rank (' + this.state.maxStatsRankScore + ')'}
                        Top5TitleCharts={'Top 5 Score Rank (' + this.state.maxStatsRankScore + ')'}
                        Top10TitleCharts={'Top 10 Score Rank (' + this.state.maxStatsRankScore + ')'}
                        data={this.state.dataRankScoreStats}
                    />
                    <KeywordStatsChart
                        title={'Trust Rank Analyse'}
                        description={' (Max Trust Rank)'}
                        top3Stats={this.state.dataTop3[0] ? this.state.dataTop3[0].trustScoreStatsTop : 0}
                        top5Stats={this.state.dataTop5[0] ? this.state.dataTop5[0].trustScoreStatsTop : 0}
                        top10Stats={this.state.dataTop10[0] ? this.state.dataTop10[0].trustScoreStatsTop : 0}
                        Top3TitleCharts={'Top 3 Trust Rank (' + this.state.maxStatsTrustScore + ')'}
                        Top5TitleCharts={'Top 5 Trust Rank (' + this.state.maxStatsTrustScore + ')'}
                        Top10TitleCharts={'Top 10 Trust Rank (' + this.state.maxStatsTrustScore + ')'}
                        data={this.state.dataTrustScoreStats}
                    />
                    <KeywordStatsChart
                        title={'Ratio Analyse'}
                        description={' (Max Ratio Trust & Score Rank)'}
                        top3Stats={this.state.dataTop3[0] ? this.state.dataTop3[0].ratioStatsTop : 0}
                        top5Stats={this.state.dataTop5[0] ? this.state.dataTop5[0].ratioStatsTop : 0}
                        top10Stats={this.state.dataTop10[0] ? this.state.dataTop10[0].ratioStatsTop : 0}
                        Top3TitleCharts={'Top 3 Ratio (' + Math.round(this.state.maxStatsRatio) + ')'}
                        Top5TitleCharts={'Top 5 Ratio (' + Math.round(this.state.maxStatsRatio) + ')'}
                        Top10TitleCharts={'Top 10 Ratio (' + Math.round(this.state.maxStatsRatio) + ')'}
                        data={this.state.dataRatioStats}
                    />
                    <KeywordStatsChart
                        title={'Traffic Analyse'}
                        description={' (Max Traffic organic)'}
                        top3Stats={this.state.dataTop3[0] ? this.state.dataTop3[0].trafficStatsTop : 0}
                        top5Stats={this.state.dataTop5[0] ? this.state.dataTop5[0].trafficStatsTop : 0}
                        top10Stats={this.state.dataTop10[0] ? this.state.dataTop10[0].trafficStatsTop : 0}
                        Top3TitleCharts={'Top 3 Traffic (' + this.state.maxStatsTraffic + ')'}
                        Top5TitleCharts={'Top 5 Traffic (' + this.state.maxStatsTraffic + ')'}
                        Top10TitleCharts={'Top 10 Traffic (' + this.state.maxStatsTraffic + ')'}
                        data={this.state.dataTrafficStats}
                    />
                    <KeywordStatsChart
                        title={'Anchor Analyse'}
                        description={' (Max Anchor)'}
                        top3Stats={this.state.dataTop3[0] ? this.state.dataTop3[0].blInfoTop : 0}
                        top5Stats={this.state.dataTop5[0] ? this.state.dataTop5[0].blInfoTop : 0}
                        top10Stats={this.state.dataTop10[0] ? this.state.dataTop10[0].blInfoTop : 0}
                        Top3TitleCharts={'Top 3 Anchor (' + this.state.maxStatsAnchors + ')'}
                        Top5TitleCharts={'Top 5 Anchor (' + this.state.maxStatsAnchors + ')'}
                        Top10TitleCharts={'Top 10 Anchor (' + this.state.maxStatsAnchors + ')'}
                        data={this.state.dataAnchorStats}
                    />
                    <KeywordStatsChart
                        title={'Https Analyse'}
                        description={' (Length Url & https or not)'}
                        top3Stats={this.state.dataTop3[0] ? this.state.dataTop3[0].httpsStatsTop : 0}
                        top5Stats={this.state.dataTop5[0] ? this.state.dataTop5[0].httpsStatsTop : 0}
                        top10Stats={this.state.dataTop10[0] ? this.state.dataTop10[0].httpsStatsTop : 0}
                        Top3TitleCharts={'Top 3 Https'}
                        Top5TitleCharts={'Top 5 Https'}
                        Top10TitleCharts={'Top 10 Https'}
                        data={this.state.dataHttpsStats}
                    />
                    <KeywordStatsChart
                        title={'Title Analyse'}
                        description={' (Length Title & Title or not)'}
                        top3Stats={this.state.dataTop3[0] ? this.state.dataTop3[0].titleStatsTop : 0}
                        top5Stats={this.state.dataTop5[0] ? this.state.dataTop5[0].titleStatsTop : 0}
                        top10Stats={this.state.dataTop10[0] ? this.state.dataTop10[0].titleStatsTop : 0}
                        Top3TitleCharts={'Top 3 Title'}
                        Top5TitleCharts={'Top 5 Title'}
                        Top10TitleCharts={'Top 10 Title'}
                        data={this.state.dataTitleStats}
                    />
                </Row>
            </Container>
        );
    }
}
