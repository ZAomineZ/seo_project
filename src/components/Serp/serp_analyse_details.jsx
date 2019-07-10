/* eslint-disable */
import React, {PureComponent} from 'react';
import ActivityChart from '../../containers/Dashboards/Fitness/components/ActivityChart';
import CryptotrendsToday from '../../containers/Dashboards/Crypto/components/CryptotrendsToday';
import DefaultTabs from '../../containers/UI/Tabs/components/DefaultTabs';
import TabsCalorie from '../tabs/tabs_calorie';
import TabsSteps from '../tabs/tabs_steps';
import TabsDistance from '../tabs/tabs_distance';
import TabsDetails from '../tabs/tabs_details';
import TabsData from '../tabs/tabs_data';
import TopBacklinks from "./top_backlinks";
import Occupancy from '../../containers/Dashboards/Booking/components/Occupancy';
import axios from "axios";
import TradeHistory from "../../containers/Dashboards/Crypto/components/TradeHistory";
import Bar from "../../containers/Charts/ReactVis/components/Bar";
import {Redirect} from "react-router-dom";

class SerpAnalyseDetails extends PureComponent {
    constructor(props) {
        super(props);
        console.error = () => {};
        console.error();
        this.state = {
            trust_rank: 0,
            score_rank: 0,
            referring_domain: '',
            referring_domain_int: 0,
            dash_stats: [],
            stats: [],
            backlink: 0,
            domain: 0,
            traffic: [],
            anchors: [],
            domain_stat: [],
            top_bl: [],
            data_asc: [],
            data_desc: [],
            data_url: [],
            data_assortUrl: [],
            error: false,
            error_message: '',
            loading: true,
            loaded: false,
        }
    }

    PropsChange(string) {
        let str_last =  string.lastIndexOf('-');
        let replace_str = string.slice(0, str_last);
        let replace_str2 = string.slice(str_last, string.length);
        let string_end = replace_str2.replace('-', '.');
        return replace_str + string_end
    }

    componentDidMount() {
        let route = '/ReactProject/App'
        axios.get("http://" + window.location.hostname + route + "/Ajax/WebSite.php", {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                'domain': this.PropsChange(this.props.match.params.domain)
            }
        }).then((response) => {
            if (response.data.error === '') {
                this.setState({
                    trust_rank: response.data.result.trust_rank,
                    score_rank: response.data.result.score_rank,
                    referring_domain: response.data.result.referring_domain,
                    referring_domain_int: response.data.result.referring_domain_int,
                    dash_stats: response.data.dash_stats,
                    stats: response.data.stats,
                    backlink: response.data.bl_info !== "" ? response.data.bl_info.data.total : [],
                    domain: response.data.bl_info !== "" ? response.data.bl_info.data.domains : [],
                    traffic: response.data.traffic_data,
                    anchors: response.data.anchors !== "" ? response.data.anchors : [],
                    domain_stat: response.data.domain_stat !== "" ? response.data.domain_stat : [],
                    top_bl: response.data.file_top_bl !== "" ? response.data.file_top_bl.data.backlinks.data : [],
                    data_asc: response.data.data_asc,
                    data_desc: response.data.data_desc,
                    data_url: response.data.data_url,
                    data_assortUrl: response.data.data_assortUrl,
                    error: response.data.error,
                    loading: false
                });
                setTimeout(() => this.setState({ loaded: true }), 500);
            } else {
                this.setState({ error : !this.state.error, error_message: response.data.error });
            }
        })
    }

    RatioRank()
    {
        return Math.round((this.state.trust_rank / this.state.score_rank) * 100);
    }

    render() {
        if (this.state.error === true) {
            return (
                <Redirect to={{
                    pathname: '/seo/serp_analyse',
                    state: {error: this.state.error_message}
                }}/>
            );
        } else {
            return (
                <div className="dashboard container">
                    {!this.state.loaded &&
                    <div className={`load${this.state.loading ? '' : ' loaded'}`}>
                        <div className="load__icon-wrap">
                            <svg className="load__icon">
                                <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                            </svg>
                        </div>
                    </div>
                    }
                    <div className="row">
                        <div className="col-md-12">
                            <h3 className="page-title">Site Analyse</h3>
                        </div>
                    </div>
                    <div className="row">
                        <DefaultTabs trust_rank={this.state.trust_rank} dash_stats={this.state.dash_stats} />
                        <TabsCalorie score_rank={this.state.score_rank} dash_stats={this.state.dash_stats} />
                        <TabsSteps ratio_rank={this.RatioRank()} dash_stats={this.state.dash_stats} />
                        <TabsDistance referring_domain={this.state.referring_domain}
                                      referring_domain_int={this.state.referring_domain_int}
                                      backlink={this.state.backlink}
                                      domain={this.state.domain}
                                      dash_stats={this.state.dash_stats} />
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <ActivityChart traffic={this.state.traffic}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-6">
                            <TabsData stats={this.state.stats} />
                        </div>
                        <div className="col-xl-6">
                            <Occupancy dash_stats={this.state.dash_stats}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-6">
                            <TradeHistory anchors={this.state.anchors} modal={1} />
                        </div>
                        <div className="col-xl-6">
                            <CryptotrendsToday data={this.state.anchors} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-6">
                            <TopBacklinks modal={1}
                                          data={this.state.top_bl}
                                          data_asc={this.state.data_asc}
                                          data_desc={this.state.data_desc}
                                          data_url={this.state.data_url}
                                          data_assortUrl={this.state.data_assortUrl} />
                        </div>
                        <TabsDetails domain_stat={this.state.domain_stat}/>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <Bar domain_stat={this.state.domain_stat}/>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default SerpAnalyseDetails;
