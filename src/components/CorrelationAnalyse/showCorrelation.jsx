/* eslint-disable */
import React, {PureComponent} from "react";
import {Container, Col, Row} from "reactstrap";
import KeywordPanel from './keywordPanel'
import KeywordStatsChart from './KeywordStatsChart'
import axios from "axios";
import {route} from "../../const";
import {BasicNotification} from "../../shared/components/Notification";
import NotificationSystem from "rc-notification";
import {Redirect} from "react-router-dom";

let notification = null;

const showNotification = (error, message) => {
    notification.notice({
        content: <BasicNotification
            color="danger"
            title={error}
            message={message ? message : "This Url is invalid !!!" }
        />,
        duration: 5,
        closable: true,
        style: {top: 0, left: 'calc(100vw - 100%)'},
        className: 'left-up',
    });
};

export default class showCorrelation extends PureComponent {

    constructor()
    {
        super();
        console.error = () => {};
        console.error();
        this.state = {
            redirectIndex: false,
            redirectSerp: false,

            loading: true,
            loaded: false,

            ipStatsTop3: 0,
            rankScoreStatsTop3: 0,
            trustScoreStatsTop3: 0,
            ratioStatsTop3: 0,
            trafficStatsTop3: 0,
            httpsStatsTop3: 0,
            titleStatsTop3: 0,

            ipStatsTop5: 0,
            rankScoreStatsTop5: 0,
            trustScoreStatsTop5: 0,
            ratioStatsTop5: 0,
            trafficStatsTop5: 0,
            httpsStatsTop5: 0,
            titleStatsTop5: 0,

            ipStatsTop10: 0,
            rankScoreStatsTop10: 0,
            trustScoreStatsTop10: 0,
            ratioStatsTop10: 0,
            trafficStatsTop10: 0,
            httpsStatsTop10: 0,
            titleStatsTop10: 0,

            maxStatsIp: 0,
            maxStatsRankScore: 0,
            maxStatsTrustScore: 0,
            maxStatsRatio: 0,
            maxStatsTraffic: 0,

            dataIpStats: [],
            dataRankScoreStats: [],
            dataTrustScoreStats: [],
            dataRatioStats: [],
            dataTrafficStats: [],
            dataHttpsStats: [],
            dataTitleStats: []
        }
    }

    /**
     * Create cookie User Auth If We reseted The Cookie in progress !!!
     * @param name_cookie
     * @param value_cookie
     * @param expire_days
     * @returns {string}
     * @constructor
     */
    SetCookie(name_cookie, value_cookie, expire_days) {
        let date = new Date();
        date.setTime(date.getTime() + (expire_days * 24 * 60 * 60 * 1000));
        let expire_cookie = "expires=" + date.toUTCString();
        return document.cookie = name_cookie + '=' + value_cookie + ";" + expire_cookie + ";path=/";
    }

    /**
     * Recuperate Cookie User
     * @param name_cookie
     * @returns {string}
     */
    getCookie(name_cookie) {
        let name = name_cookie + '=';
        let cookie = document.cookie.split(';');
        for (let i = 0; i < cookie.length; i++) {
            let cook = cookie[i];
            while (cook.charAt(0) == ' ') {
                cook = cook.substring(1);
            }
            if (cook.indexOf(name) == 0) {
                return cook.substring(name.length, cook.length);
            }
            return '';
        }
    }

    /**
     * Reset Cookie User When Invalid Token found in the Request Ajax with Axios
     * @param token
     * @param id
     * @constructor
     */
    CookieReset(token, id) {
        if (this.getCookie('remember_me_auth')) {
            this.SetCookie('remember_me_auth', token + '__' + id, 30)
        } else {
            this.SetCookie('auth_today', token + '__' + id, 1)
        }
        this.setState({redirectSerp: !this.state.redirectSerp})
    }

    componentDidMount() {
        let keyword = this.props.match.params.keyword;
        if (keyword && keyword !== '') {
            axios.get('http://' + window.location.hostname + route + '/Ajax/Correlation/CorrelationData.php', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, HEAD',
                    'Access-Control-Allow-Credentials': true,
                    'Access-Control-Expose-Headers': 'Content-Lenght, Content-Range',
                    'Access-Control-Max-Age': 1728000,
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Allow-Credentials, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Max-Age, Origin, X-Requested-With, Content-Type, Accept, Authorization',
                },
                params: {
                    keyword: keyword,
                    cookie: this.getCookie('remember_me_auth') ?
                        this.getCookie('remember_me_auth') :
                        this.getCookie('auth_today'),
                    auth: sessionStorage.getItem('Auth') ?
                        sessionStorage.getItem('Auth')
                        : ''
                }
            }).then((response) => {
                if (response && response.status === 200) {
                    if (response.data.error) {
                        if (response.data.error === 'Invalid Token') {
                            this.CookieReset(response.data.token, response.data.id);
                        } else {
                            this.setState({redirectIndex: !this.state.redirectIndex});
                            NotificationSystem.newInstance({}, n => notification = n);
                            setTimeout(() => showNotification('👋 Warning !!!', response.data.error), 700);
                        }
                    } else {
                        let dataAverage = response.data.dataTopAverage;
                        let dataWebsite = response.data.dataWebsiteStats;
                        this.setState({
                            ipStatsTop3: dataAverage.referring_ip.top3.average,
                            rankScoreStatsTop3: dataAverage.score_rank.top3.average,
                            trustScoreStatsTop3: dataAverage.trust_rank.top3.average,
                            ratioStatsTop3: dataAverage.ratio.top3.average,
                            trafficStatsTop3: dataAverage.traffic.top3.average,
                            httpsStatsTop3: dataAverage.https.top3.average,
                            titleStatsTop3: dataAverage.title.top3.average,

                            ipStatsTop5: dataAverage.referring_ip.top5.average,
                            rankScoreStatsTop5: dataAverage.score_rank.top5.average,
                            trustScoreStatsTop5: dataAverage.trust_rank.top5.average,
                            ratioStatsTop5: dataAverage.ratio.top5.average,
                            trafficStatsTop5: dataAverage.traffic.top5.average,
                            httpsStatsTop5: dataAverage.https.top5.average,
                            titleStatsTop5: dataAverage.title.top5.average,

                            ipStatsTop10: dataAverage.referring_ip.top10.average,
                            rankScoreStatsTop10: dataAverage.score_rank.top10.average,
                            trustScoreStatsTop10: dataAverage.trust_rank.top10.average,
                            ratioStatsTop10: dataAverage.ratio.top10.average,
                            trafficStatsTop10: dataAverage.traffic.top10.average,
                            httpsStatsTop10: dataAverage.https.top10.average,
                            titleStatsTop10: dataAverage.title.top10.average,

                            maxStatsIp: dataAverage.referring_ip.maxValue,
                            maxStatsRankScore: dataAverage.score_rank.maxValue,
                            maxStatsTrustScore: dataAverage.trust_rank.maxValue,
                            maxStatsRatio: dataAverage.ratio.maxValue,
                            maxStatsTraffic: dataAverage.traffic.maxValue
                        });
                        this.setState({
                            dataIpStats: Object.values(dataWebsite.referring_ip),
                            dataRankScoreStats: Object.values(dataWebsite.score_rank),
                            dataTrustScoreStats: Object.values(dataWebsite.trust_rank),
                            dataRatioStats: Object.values(dataWebsite.ratio),
                            dataTrafficStats: Object.values(dataWebsite.traffic),
                            dataHttpsStats: Object.values(dataWebsite.https),
                            dataTitleStats: Object.values(dataWebsite.title)
                        });
                        this.setState({ loading: !this.state.loading });
                        setTimeout(() => this.setState({ loaded: true }), 500);
                    }
                }
            })
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
                            <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                        </svg>
                    </div>
                </div>
                }
                <Row>
                    <Col md={12}>
                        <h3 className="page-title">Correlation Analyse: {this.props.match.params.keyword}</h3>
                    </Col>
                </Row>
                <Row>
                    <div className="col-md-4 col-xs-4">
                        <KeywordPanel title={'Top 3 Correlation'}
                                      ipStats={this.state.ipStatsTop3}
                                      rankScoreStats={this.state.rankScoreStatsTop3}
                                      trustScoreStats={this.state.trustScoreStatsTop3}
                                      ratioStats={this.state.ratioStatsTop3}
                                      trafficStats={this.state.trafficStatsTop3}
                                      httpsStats={this.state.httpsStatsTop3}
                                      titleStats={this.state.titleStatsTop3}
                                      charts={false} />
                    </div>
                    <div className="col-md-4 col-xs-4">
                        <KeywordPanel title={'Top 5 Correlation'}
                                      ipStats={this.state.ipStatsTop5}
                                      rankScoreStats={this.state.rankScoreStatsTop5}
                                      trustScoreStats={this.state.trustScoreStatsTop5}
                                      ratioStats={this.state.ratioStatsTop5}
                                      trafficStats={this.state.trafficStatsTop5}
                                      httpsStats={this.state.httpsStatsTop5}
                                      titleStats={this.state.titleStatsTop5}
                                      charts={false} />
                    </div>
                    <div className="col-md-4 col-xs-4">
                        <KeywordPanel title={'Top 10 Correlation'}
                                      ipStats={this.state.ipStatsTop10}
                                      rankScoreStats={this.state.rankScoreStatsTop10}
                                      trustScoreStats={this.state.trustScoreStatsTop10}
                                      ratioStats={this.state.ratioStatsTop10}
                                      trafficStats={this.state.trafficStatsTop10}
                                      httpsStats={this.state.httpsStatsTop10}
                                      titleStats={this.state.titleStatsTop10}
                                      charts={false} />
                    </div>
                </Row>
                <Row>
                    <KeywordStatsChart
                        title={'Referring Ip Analyse'}
                        top3Stats={this.state.ipStatsTop3}
                        top5Stats={this.state.ipStatsTop5}
                        top10Stats={this.state.ipStatsTop10}
                        Top3TitleCharts={'Top 3 Referring IP (' + this.state.maxStatsIp + ')'}
                        Top5TitleCharts={'Top 5 Referring IP (' + this.state.maxStatsIp + ')'}
                        Top10TitleCharts={'Top 10 Referring IP (' + this.state.maxStatsIp + ')'}
                        data={this.state.dataIpStats}
                    />
                    <KeywordStatsChart
                        title={'Score Rank Analyse'}
                        top3Stats={this.state.rankScoreStatsTop3}
                        top5Stats={this.state.rankScoreStatsTop5}
                        top10Stats={this.state.rankScoreStatsTop10}
                        Top3TitleCharts={'Top 3 Score Rank (' + this.state.maxStatsRankScore + ')'}
                        Top5TitleCharts={'Top 5 Score Rank (' + this.state.maxStatsRankScore + ')'}
                        Top10TitleCharts={'Top 10 Score Rank (' + this.state.maxStatsRankScore + ')'}
                        data={this.state.dataRankScoreStats}
                    />
                    <KeywordStatsChart
                        title={'Trust Rank Analyse'}
                        top3Stats={this.state.trustScoreStatsTop3}
                        top5Stats={this.state.trustScoreStatsTop5}
                        top10Stats={this.state.trustScoreStatsTop10}
                        Top3TitleCharts={'Top 3 Trust Rank (' + this.state.maxStatsTrustScore + ')'}
                        Top5TitleCharts={'Top 5 Trust Rank (' + this.state.maxStatsTrustScore + ')'}
                        Top10TitleCharts={'Top 10 Trust Rank (' + this.state.maxStatsTrustScore + ')'}
                        data={this.state.dataTrustScoreStats}
                    />
                    <KeywordStatsChart
                        title={'Ratio Analyse'}
                        top3Stats={this.state.ratioStatsTop3}
                        top5Stats={this.state.ratioStatsTop5}
                        top10Stats={this.state.ratioStatsTop10}
                        Top3TitleCharts={'Top 3 Ratio (' + Math.round(this.state.maxStatsRatio) + ')'}
                        Top5TitleCharts={'Top 5 Ratio (' + Math.round(this.state.maxStatsRatio) + ')'}
                        Top10TitleCharts={'Top 10 Ratio (' + Math.round(this.state.maxStatsRatio) + ')'}
                        data={this.state.dataRatioStats}
                    />
                    <KeywordStatsChart
                        title={'Traffic Analyse'}
                        top3Stats={this.state.trafficStatsTop3}
                        top5Stats={this.state.trafficStatsTop5}
                        top10Stats={this.state.trafficStatsTop10}
                        Top3TitleCharts={'Top 3 Traffic (' + this.state.maxStatsTraffic + ')'}
                        Top5TitleCharts={'Top 5 Traffic (' + this.state.maxStatsTraffic + ')'}
                        Top10TitleCharts={'Top 10 Traffic (' + this.state.maxStatsTraffic + ')'}
                        data={this.state.dataTrafficStats}
                    />
                    <KeywordStatsChart
                        title={'Https Analyse'}
                        top3Stats={this.state.httpsStatsTop3}
                        top5Stats={this.state.httpsStatsTop5}
                        top10Stats={this.state.httpsStatsTop10}
                        Top3TitleCharts={'Top 3 Https'}
                        Top5TitleCharts={'Top 5 Https'}
                        Top10TitleCharts={'Top 10 Https'}
                        data={this.state.dataHttpsStats}
                    />
                    <KeywordStatsChart
                        title={'Title Analyse'}
                        top3Stats={this.state.titleStatsTop3}
                        top5Stats={this.state.titleStatsTop5}
                        top10Stats={this.state.titleStatsTop10}
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
